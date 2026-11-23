#!/usr/bin/env python3
"""Entrées Chrono Quiz du « Calendrier des chaînes » : 3 épisodes par jour (voir planning.py).

Usage : python3 quiz/outils/calendrier.py   → quiz/calendrier_quiz.json
Chaque entrée a le même format que les autres chaînes du calendrier
(serie, id, num, titre, date, heure, fichiers, f = textes par réseau).
"""
import glob
import json
import os

import generer as g
from planning import horaire
from publications import THEME, pub


def sujets():
    s = {}
    for ligne in open(os.path.join(g.RACINE, "PLAN_100_EPISODES.md"), encoding="utf-8"):
        if ligne.startswith("| 0") or ligne.startswith("| 1"):
            c = [x.strip() for x in ligne.strip().strip("|").split("|")]
            if c[0].isdigit():
                s[int(c[0])] = c[2]
    return s


def entrees():
    S = sujets()
    out = []
    for f in sorted(glob.glob(os.path.join(g.EPISODES, "ep*.json"))):
        ep = json.load(open(f, encoding="utf-8"))
        n, nom = ep["numero"], os.path.splitext(os.path.basename(f))[0]
        theme = THEME[ep["theme"]]["nom"]
        out.append({
            "serie": "quiz", "id": f"quiz-{n}", "num": n,
            "titre": f"{theme[0].upper() + theme[1:]} : {S.get(n, ep['accroche'])}",
            "date": horaire(n, ep["theme"])[0], "heure": horaire(n, ep["theme"])[1],
            "fichiers": f"Vidéo : {nom}.mp4 · Story : {nom}_story.png",
            "f": pub(ep),
        })
    return sorted(out, key=lambda e: e["num"])


if __name__ == "__main__":
    E = entrees()
    with open(os.path.join(g.RACINE, "calendrier_quiz.json"), "w", encoding="utf-8") as f:
        json.dump(E, f, ensure_ascii=False, indent=1)
    print(len(E), "épisodes, du", E[0]["date"], "au", E[-1]["date"])
