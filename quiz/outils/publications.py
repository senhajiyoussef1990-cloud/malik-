#!/usr/bin/env python3
"""Textes de publication Chrono Quiz pour tous les réseaux, à partir d'un épisode.

Réseaux (mêmes clés que le « Calendrier des chaînes ») :
  meta    : Facebook + Instagram (Reel)
  yt      : YouTube Shorts
  tt      : TikTok
  story   : story Instagram / Facebook / YouTube
  storytt : story TikTok

Usage : python3 quiz/outils/publications.py --tous   → réécrit sortie/epNN_..._publication.txt
"""
import argparse
import glob
import json
import os

HEURE = "12 h"   # heure de publication de Chrono Quiz dans le calendrier

THEME = {
    "foot": {"nom": "foot", "emoji": "⚽", "tags": ["#Foot", "#Football", "#QuizFoot", "#FootballQuiz"],
             "defi": "Tag un pote qui se croit expert en foot 😏"},
    "logique": {"nom": "logique", "emoji": "🧠", "tags": ["#Logique", "#Enigme", "#CasseTete", "#QuizLogique"],
                "defi": "Envoie-le à quelqu'un qui pense être super malin 😏"},
    "culture": {"nom": "culture générale", "emoji": "🌍", "tags": ["#CultureGenerale", "#Culture", "#QuizCulture",
                                                                   "#Apprendre"],
                "defi": "Partage à quelqu'un qui pense tout savoir 😏"},
}
COMMUNS = ["#ChronoQuiz", "#Quiz"]
TIKTOK = ["#PourToi", "#fyp", "#foryou", "#ApprendreSurTikTok"]


def pub(ep):
    """Renvoie {réseau: [[étiquette, texte], …]} pour un épisode."""
    t = THEME[ep["theme"]]
    n, nb = ep["numero"], len(ep["questions"])
    q1 = ep["questions"][0]["question"]
    titre_yt = ep.get("titre_youtube", ep["accroche"])
    pause = "\nBesoin de réfléchir ? Appuie sur pause ⏸️" if ep.get("pause_par_question") else ""
    tags = " ".join(COMMUNS + t["tags"])

    meta_titre = f"{t['emoji']} {ep['accroche']}"
    meta_desc = (f"Quiz {t['nom']} n°{n} : {nb} questions, de facile à difficile. ⏱️ 4 secondes pour répondre !{pause}\n"
                 f"Première question : {q1}\n"
                 f"Écris ton score sur {nb} en commentaire 👇\n"
                 f"{t['defi']}\n\n{tags} #Reels")
    yt_titre = f"{titre_yt} #Shorts"
    if len(yt_titre) > 100:
        yt_titre = yt_titre[:92].rstrip() + "… #Shorts"
    yt_desc = (f"{ep['accroche']}\n"
               f"Quiz {t['nom']} n°{n} de Chrono Quiz : {nb} questions, de facile à difficile, "
               f"4 secondes pour répondre.{pause}\n"
               f"Écris ton score en commentaire et abonne-toi pour un nouveau quiz chaque jour !\n\n"
               f"{tags} #Shorts")
    tt_titre = f"{ep['accroche']} {t['emoji']}⏱️"
    tt_desc = f"Quiz {t['nom']} n°{n} : ton score en commentaire 👇\n\n" + " ".join(COMMUNS + t["tags"] + TIKTOK)
    story = f"NOUVEAU QUIZ {t['emoji']}\n{t['nom'].upper()} · ÉPISODE {n}\nAUJOURD'HUI À {HEURE.upper()}"
    return {
        "meta": [["Titre", meta_titre], ["Description", meta_desc]],
        "yt": [["Titre", yt_titre], ["Description", yt_desc]],
        "tt": [["Titre", tt_titre], ["Description", tt_desc]],
        "story": [["Texte de la story", story]],
        "storytt": [["Texte de la story", story]],
    }


NOMS = [("meta", "FACEBOOK + INSTAGRAM (Reel)"), ("yt", "YOUTUBE SHORTS"), ("tt", "TIKTOK"),
        ("story", "STORY Instagram / Facebook / YouTube (le matin)"), ("storytt", "STORY TikTok (le matin)")]
LIGNE = "═" * 42


def texte(ep, video):
    f = pub(ep)
    t = [f"CHRONO QUIZ — ÉPISODE {ep['numero']} ({THEME[ep['theme']]['nom']})",
         f"Vidéo : {video} (9:16, 1080×1920) · publication à {HEURE}", ""]
    for cle, nom in NOMS:
        t += [LIGNE, nom, LIGNE]
        for lab, txt in f[cle]:
            t += [f"{lab.upper()} :", txt, ""]
    return "\n".join(t)


if __name__ == "__main__":
    import generer as g
    ap = argparse.ArgumentParser()
    ap.add_argument("fichiers", nargs="*")
    ap.add_argument("--tous", action="store_true")
    a = ap.parse_args()
    fichiers = sorted(glob.glob(os.path.join(g.EPISODES, "*.json"))) if a.tous else a.fichiers
    os.makedirs(g.SORTIE, exist_ok=True)
    for f in fichiers:
        ep = json.load(open(f, encoding="utf-8"))
        nom = os.path.splitext(os.path.basename(f))[0]
        with open(os.path.join(g.SORTIE, nom + "_publication.txt"), "w", encoding="utf-8") as s:
            s.write(texte(ep, nom + ".mp4"))
    print(len(fichiers), "textes de publication écrits")
