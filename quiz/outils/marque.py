#!/usr/bin/env python3
"""Images de la chaîne Chrono Quiz : photo de profil (800x800) et bannière YouTube (2560x1440).

Usage : python3 quiz/outils/marque.py   → quiz/marque/
"""
import os

from PIL import Image, ImageDraw

import generer as g

DOSSIER = os.path.join(g.RACINE, "marque")


def degrade(w, h, haut, bas):
    im = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        a = y / h
        d.line([0, y, w, y], fill=tuple(int(haut[i] * (1 - a) + bas[i] * a) for i in range(3)))
    return im


def profil():
    im = degrade(800, 800, (14, 20, 44), (30, 40, 90))
    d = ImageDraw.Draw(im, "RGBA")
    g.chrono(d, 400, 330, 170, g.JAUNE, angle=-45, fond=g.NUIT, epaisseur=30)
    f = g.police(g.FONT_TITRE, 128)
    d.text((400, 610), "CHRONO", font=f, fill=g.BLANC, anchor="mm")
    d.text((400, 730), "QUIZ", font=g.police(g.FONT_TITRE, 96), fill=g.JAUNE, anchor="mm")
    im.save(os.path.join(DOSSIER, "photo_profil.png"))


def banniere():
    W, H = 2560, 1440
    im = degrade(W, H, (14, 20, 44), (30, 40, 90))
    d = ImageDraw.Draw(im, "RGBA")
    # moitié gauche verte (foot), moitié droite violette (logique), en bandes diagonales discrètes
    for i in range(-H, W, 160):
        d.polygon([(i, H), (i + 80, H), (i + 80 + H, 0), (i + H, 0)], fill=(255, 255, 255, 6))
    g.chrono(d, 2300, 1250, 420, (255, 255, 255, 14), angle=-60, epaisseur=40)
    # zone sûre YouTube : 1546x423 au centre
    cy = H / 2
    g.logo(d, W / 2, cy - 60, 170)
    f, ft = g.police(g.FONT_TEXTE, 52), g.police(g.FONT_TEXTE, 46)
    etiquettes = [("FOOT", "foot"), ("LOGIQUE", "logique"), ("CULTURE G", "culture")]
    larg = [d.textlength(t, font=f) + 80 for t, _ in etiquettes]
    wc = d.textlength("1 quiz par jour", font=ft)
    esp = 26
    x = W / 2 - (sum(larg) + wc + len(etiquettes) * esp) / 2
    y = cy + 110
    for (t, th), w in zip(etiquettes, larg):
        g.pastille(d, x + w / 2, y, t, f, g.THEMES[th]["accent"], g.SOMBRE, pad=40, h=84)
        x += w + esp
    d.text((x, y), "1 quiz par jour", font=ft, fill=g.BLANC, anchor="lm")
    im.save(os.path.join(DOSSIER, "banniere.png"))


if __name__ == "__main__":
    os.makedirs(DOSSIER, exist_ok=True)
    profil()
    banniere()
    print(DOSSIER)
