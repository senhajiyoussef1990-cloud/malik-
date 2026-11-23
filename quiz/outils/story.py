#!/usr/bin/env python3
"""Image de story (1080x1920) pour annoncer un épisode Chrono Quiz le matin.

Usage : python3 quiz/outils/story.py --tous   → sortie/epNN_..._story.png
"""
import argparse
import glob
import json
import os

import generer as g
from publications import HEURE


def story(ep):
    th = g.THEMES[ep["theme"]]
    im = g.fond(ep["theme"])
    d = g.Dessin(im)
    g.chrono(d, g.W / 2, 560, 170, g.JAUNE, angle=-45, fond=g.NUIT + (220,), epaisseur=28)
    f = g.police(g.FONT_TITRE, 150)
    d.text((g.W / 2, 880), "CHRONO", font=f, fill=g.BLANC, anchor="mm")
    d.text((g.W / 2, 1030), "QUIZ", font=f, fill=g.JAUNE, anchor="mm")
    g.pastille(d, g.W / 2, 1200, f"NOUVEAU QUIZ {th['nom']}", g.police(g.FONT_TITRE, 54), th["accent"], g.SOMBRE,
               pad=40, h=96)
    d.text((g.W / 2, 1310), f"ÉPISODE {ep['numero']}", font=g.police(g.FONT_TITRE, 70), fill=g.BLANC, anchor="mm")
    fq = g.police(g.FONT_TEXTE, 50)
    g.texte_centre(d, g.couper(ep["accroche"], fq, g.W - 200, d), fq, g.W / 2, 1390, g.BLANC, 1.25)
    d.rounded_rectangle([g.W / 2 - 300, 1600, g.W / 2 + 300, 1700], radius=50, fill=g.ROUGE)
    d.text((g.W / 2, 1650), f"AUJOURD'HUI À {HEURE.upper()}", font=g.police(g.FONT_TITRE, 54), fill=g.BLANC,
           anchor="mm")
    return im


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("fichiers", nargs="*")
    ap.add_argument("--tous", action="store_true")
    a = ap.parse_args()
    fichiers = sorted(glob.glob(os.path.join(g.EPISODES, "*.json"))) if a.tous else a.fichiers
    os.makedirs(g.SORTIE, exist_ok=True)
    for f in fichiers:
        ep = json.load(open(f, encoding="utf-8"))
        nom = os.path.splitext(os.path.basename(f))[0]
        story(ep).save(os.path.join(g.SORTIE, nom + "_story.png"), optimize=True)
    print(len(fichiers), "stories écrites")
