#!/usr/bin/env python3
"""Fait écouter chaque phrase de la voix off par une reconnaissance vocale (Whisper),
pour repérer les phrases qui ne sonnent pas françaises (accent espagnol, portugais…)
ou qui sont mal prononcées.

Usage :
    pip install faster-whisper
    python3 quiz/outils/verifier_voix.py --tous
    python3 quiz/outils/verifier_voix.py quiz/episodes/ep07_foot.json

Pour chaque phrase : la langue reconnue (doit être « fr »), sa probabilité, et la
ressemblance entre ce qui a été entendu et le texte prévu. Les phrases douteuses sont
listées à la fin, et le code de sortie vaut 1 s'il y en a.
"""
import argparse
import difflib
import glob
import json
import os
import re
import sys
import unicodedata

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")

import numpy as np

import generer as g

SEUIL_LANGUE = 0.95      # probabilité minimale que la phrase soit du français
SEUIL_TEXTE = 0.75       # ressemblance minimale entre l'entendu et le prévu


def textes_voix(ep):
    """Toutes les phrases dites dans un épisode, dans l'ordre (même logique que generer.py)."""
    th = g.THEMES[ep["theme"]]
    bienvenue = ep.get("bienvenue", f"Bienvenue dans Chrono Quiz ! Spécial {th.get('court', th['nom'].lower())}.")
    out = [bienvenue + " " + ep["accroche"]]
    if ep.get("pause_par_question", False):
        out.append(ep.get("pause", g.PHRASE_PAUSE))
    for q in ep["questions"]:
        out.append(q.get("voix", q["question"]))
        out.append(g.phrase_reponse(q))
    out.append(ep.get("fin", g.PHRASE_FIN))
    return out


def normaliser(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^a-z0-9 ]+", " ", t)
    return " ".join(t.split())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("fichiers", nargs="*")
    ap.add_argument("--tous", action="store_true")
    ap.add_argument("--modele", default="small")
    args = ap.parse_args()
    fichiers = sorted(glob.glob(os.path.join(g.EPISODES, "*.json"))) if args.tous else args.fichiers

    from faster_whisper import WhisperModel
    modele = WhisperModel(args.modele, device="cpu", compute_type="int8")

    # 1) toutes les voix sont créées d'abord, en parallèle (c'est l'étape la plus lente)
    from concurrent.futures import ThreadPoolExecutor
    textes = []
    for f in fichiers:
        for t in textes_voix(json.load(open(f, encoding="utf-8"))):
            if t not in textes:
                textes.append(t)
    with ThreadPoolExecutor(6) as ex:
        list(ex.map(g.tts, textes))
    print(f"{len(textes)} voix prêtes", flush=True)

    # 2) chaque phrase est écoutée
    vus, douteux = set(), []
    for f in fichiers:
        ep = json.load(open(f, encoding="utf-8"))
        for texte in textes_voix(ep):
            if texte in vus:
                continue
            vus.add(texte)
            audio = g.tts(texte)
            audio16 = audio[:: g.SR // 16000 if g.SR % 16000 == 0 else 1]
            if g.SR != 16000:  # rééchantillonnage simple vers 16 kHz
                n = int(len(audio) * 16000 / g.SR)
                audio16 = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype(np.float32)
            # une seule écoute : la langue est détectée, puis le texte est transcrit dans cette langue
            segs, info = modele.transcribe(audio16, beam_size=1)
            entendu = " ".join(s.text for s in segs).strip()
            proba_fr = dict(info.all_language_probs or []).get("fr", 0.0)
            ressemblance = difflib.SequenceMatcher(None, normaliser(texte), normaliser(entendu)).ratio()
            ok = info.language == "fr" and proba_fr >= SEUIL_LANGUE and ressemblance >= SEUIL_TEXTE
            marque = "OK " if ok else "?? "
            print(f"{marque} {os.path.basename(f):22s} langue={info.language} fr={proba_fr:.2f} "
                  f"texte={ressemblance:.2f} | {texte}", flush=True)
            if not ok:
                douteux.append((os.path.basename(f), info.language, proba_fr, ressemblance, texte, entendu))

    print(f"\n{len(vus)} phrases écoutées, {len(douteux)} douteuses.")
    for nom, lang, p, r, texte, entendu in douteux:
        print(f"- {nom} : langue {lang} (fr {p:.2f}), ressemblance {r:.2f}\n    prévu   : {texte}\n    entendu : {entendu}")
    sys.exit(1 if douteux else 0)


if __name__ == "__main__":
    main()
