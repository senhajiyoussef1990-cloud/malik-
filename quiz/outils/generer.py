#!/usr/bin/env python3
"""Chrono Quiz : génère un Short de quiz (vidéo verticale 1080x1920).

Usage :
    python3 quiz/outils/generer.py quiz/episodes/ep01_foot.json
    python3 quiz/outils/generer.py --tous          # tous les épisodes de quiz/episodes/

La voix off est générée avec edge-tts (gratuit) ou ElevenLabs (QUIZ_TTS=eleven),
mise en cache dans quiz/cache/. Les vidéos et les textes de publication sortent dans quiz/sortie/.
"""
import argparse
import glob
import hashlib
import json
import math
import os
import subprocess
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
CACHE = os.path.join(RACINE, "cache")
SORTIE = os.path.join(RACINE, "sortie")
EPISODES = os.path.join(RACINE, "episodes")
FONT_TITRE = os.path.join(RACINE, "fonts", "oswald-latin-700-normal.ttf")
FONT_TEXTE = os.path.join(RACINE, "fonts", "inter-latin-700-normal.ttf")

W, H = 1080, 1920
FPS = 30
SR = 44100
DUREE_COMPTE = 4
VOIX_ID = os.environ.get("QUIZ_VOIX", "GPAQQPp9dazaB2bl4zg9")
MODELE = "eleven_multilingual_v2"
VOIX_EDGE = os.environ.get("QUIZ_VOIX_EDGE", "fr-FR-RemyMultilingualNeural")

# ---------------------------------------------------------------- identité visuelle
MARQUE = "CHRONO QUIZ"
PSEUDO = "@ChronoQuiz"
JAUNE = (250, 204, 21)        # couleur de la marque (logo, chrono)
NUIT = (11, 16, 32)           # bleu nuit des éléments sombres
BLANC = (255, 255, 255)
SOMBRE = (17, 24, 39)
VERT = (34, 197, 94)
ROUGE = (239, 68, 68)
LETTRES = "ABCD"
NIVEAUX = {"facile": ("FACILE", (34, 197, 94)), "moyen": ("MOYEN", (249, 115, 22)),
           "difficile": ("DIFFICILE", (239, 68, 68))}
THEMES = {
    "foot": {"nom": "FOOT", "haut": (6, 46, 24), "bas": (16, 102, 48), "accent": JAUNE, "motif": "terrain"},
    "logique": {"nom": "LOGIQUE", "haut": (24, 12, 60), "bas": (58, 36, 136), "accent": (34, 211, 238),
                "motif": "points"},
    "culture": {"nom": "CULTURE GÉNÉRALE", "court": "culture générale", "haut": (8, 30, 64),
                "bas": (14, 74, 120), "accent": (251, 146, 60), "motif": "questions"},
}


# ---------------------------------------------------------------- audio
def _edge(texte, mp3):
    import asyncio
    import certifi
    ca = "/root/.ccr/ca-bundle.crt"
    if os.path.exists(ca):  # derrière le proxy du conteneur cloud
        certifi.where = lambda: ca
    import edge_tts
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    asyncio.run(edge_tts.Communicate(texte, VOIX_EDGE, rate="+8%", proxy=proxy).save(mp3))


def _eleven(texte, mp3):
    corps = json.dumps({"text": texte, "model_id": MODELE,
                        "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35}}).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOIX_ID}", data=corps,
        headers={"Content-Type": "application/json", "Accept": "audio/mpeg",
                 "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "x")})
    with urllib.request.urlopen(req, timeout=120) as r, open(mp3, "wb") as f:
        f.write(r.read())


def tts(texte):
    os.makedirs(CACHE, exist_ok=True)
    moteur = os.environ.get("QUIZ_TTS", "edge")
    voix = VOIX_ID if moteur == "eleven" else VOIX_EDGE
    cle = hashlib.sha1(f"{moteur}|{voix}|{texte}".encode()).hexdigest()[:16]
    mp3 = os.path.join(CACHE, cle + ".mp3")
    for essai in range(3):
        if not os.path.exists(mp3):
            tmp = mp3 + ".tmp.mp3"
            (_eleven if moteur == "eleven" else _edge)(texte, tmp)
            os.replace(tmp, mp3)  # jamais de fichier à moitié écrit dans le cache
        r = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                           capture_output=True)
        if r.returncode == 0 and r.stdout:
            return np.frombuffer(r.stdout, dtype=np.float32)
        os.remove(mp3)  # fichier illisible : on refait la voix
    raise RuntimeError(f"Voix impossible à générer : {texte!r}")


def son_tic(aigu=False):
    t = np.arange(int(SR * 0.06)) / SR
    return (0.35 * np.sin(2 * np.pi * (1600 if aigu else 1200) * t) * np.exp(-t * 60)).astype(np.float32)


def son_whoosh():
    n = int(SR * 0.45)
    t = np.arange(n) / SR
    bruit = np.random.default_rng(1).standard_normal(n)
    env = np.sin(np.pi * t / t[-1]) ** 2
    return (0.25 * np.convolve(bruit, np.ones(12) / 12, mode="same") * env).astype(np.float32)


def son_bonne_reponse():
    sortie = np.zeros(int(SR * 0.7), dtype=np.float32)
    for i, f in enumerate([880, 1320]):
        t = np.arange(int(SR * 0.45)) / SR
        note = 0.3 * np.sin(2 * np.pi * f * t) * np.exp(-t * 6)
        d = int(i * 0.12 * SR)
        sortie[d:d + len(note)] += note
    return sortie


# ---------------------------------------------------------------- outils de dessin
_polices = {}


class Dessin:
    """ImageDraw qui respecte aussi la transparence du texte (Pillow l'ignore sur une image RGB)."""

    def __init__(self, im):
        self.im = im
        self.d = ImageDraw.Draw(im, "RGBA")

    def __getattr__(self, nom):
        return getattr(self.d, nom)

    def text(self, xy, texte, fill=BLANC, **kw):
        if len(fill) == 4 and fill[3] < 255:
            if fill[3] <= 0:
                return
            masque = Image.new("L", self.im.size, 0)
            ImageDraw.Draw(masque).text(xy, texte, fill=fill[3], **kw)
            self.im.paste(fill[:3], mask=masque)
        else:
            self.d.text(xy, texte, fill=fill[:3], **kw)


def police(chemin, taille):
    cle = (chemin, int(taille))
    if cle not in _polices:
        _polices[cle] = ImageFont.truetype(chemin, int(taille))
    return _polices[cle]


def couper(texte, fnt, largeur, d):
    # espaces insécables : jamais de « ? », « ! », « : » ou guillemet seul en début de ligne
    for a, b in ((" ?", "\u00a0?"), (" !", "\u00a0!"), (" :", "\u00a0:"), ("« ", "«\u00a0"), (" »", "\u00a0»")):
        texte = texte.replace(a, b)
    lignes, cur = [], ""
    for mot in texte.split(" "):
        essai = (cur + " " + mot).strip()
        if d.textlength(essai, font=fnt) <= largeur:
            cur = essai
        else:
            lignes.append(cur)
            cur = mot
    if cur:
        lignes.append(cur)
    return lignes


def texte_centre(d, lignes, fnt, cx, y, couleur, interligne=1.18):
    h = fnt.size * interligne
    for i, l in enumerate(lignes):
        d.text((cx, y + i * h + h / 2), l, font=fnt, fill=couleur, anchor="mm")
    return y + len(lignes) * h


def pastille(d, cx, cy, texte, fnt, fond, couleur, pad=26, h=None):
    """Étiquette arrondie centrée en (cx, cy). Renvoie sa largeur."""
    w = d.textlength(texte, font=fnt) + 2 * pad
    h = h or fnt.size * 1.7
    d.rounded_rectangle([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], radius=h / 2, fill=fond)
    d.text((cx, cy), texte, font=fnt, fill=couleur, anchor="mm")
    return w


def chrono(d, cx, cy, r, couleur, angle=-90, epaisseur=None, fond=None, aiguille=True):
    """Le logo : un chronomètre (cadran, bouton du dessus, petit bouton à droite, aiguille)."""
    e = epaisseur or max(4, int(r * 0.16))
    # bouton du dessus + tige
    d.rounded_rectangle([cx - r * 0.22, cy - r - r * 0.42, cx + r * 0.22, cy - r - r * 0.2], radius=r * 0.06,
                        fill=couleur)
    d.rectangle([cx - r * 0.09, cy - r - r * 0.22, cx + r * 0.09, cy - r + e * 0.5], fill=couleur)
    # petit bouton à 45°
    a = math.radians(-45)
    bx, by = cx + math.cos(a) * (r + r * 0.12), cy + math.sin(a) * (r + r * 0.12)
    d.ellipse([bx - r * 0.13, by - r * 0.13, bx + r * 0.13, by + r * 0.13], fill=couleur)
    if fond:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fond)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=couleur, width=e)
    if aiguille:
        ar = math.radians(angle)
        d.line([cx, cy, cx + math.cos(ar) * r * 0.62, cy + math.sin(ar) * r * 0.62], fill=couleur,
               width=max(3, int(e * 0.8)))
        d.ellipse([cx - e * 0.7, cy - e * 0.7, cx + e * 0.7, cy + e * 0.7], fill=couleur)


def logo(d, cx, cy, taille, alpha=255, angle=-45):
    """Logo complet : chrono + « CHRONO QUIZ » sur une ligne, centré en (cx, cy)."""
    f = police(FONT_TITRE, taille)
    m1, m2 = "CHRONO ", "QUIZ"
    w1, w2 = d.textlength(m1, font=f), d.textlength(m2, font=f)
    r = taille * 0.36
    total = r * 2 + taille * 0.28 + w1 + w2
    x = cx - total / 2
    chrono(d, x + r, cy + taille * 0.04, r, JAUNE + (alpha,), angle=angle)
    x += r * 2 + taille * 0.28
    d.text((x, cy), m1, font=f, fill=BLANC + (alpha,), anchor="lm")
    d.text((x + w1, cy), m2, font=f, fill=JAUNE + (alpha,), anchor="lm")


def fond(theme):
    th = THEMES[theme]
    a = np.linspace(0, 1, H)[:, None, None]
    img = (np.array(th["haut"]) * (1 - a) + np.array(th["bas"]) * a)
    # vignette : bords plus sombres
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H * 0.45) / (H * 0.7)) ** 2)
    img = img * np.clip(1.15 - 0.55 * dist, 0.45, 1.0)[:, :, None]
    im = Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGB")
    d = Dessin(im)
    if th["motif"] == "terrain":
        bande = H // 12
        for i in range(0, H, bande * 2):
            d.rectangle([0, i, W, i + bande], fill=(255, 255, 255, 9))
        r = W * 0.36
        d.ellipse([W / 2 - r, H * 0.5 - r, W / 2 + r, H * 0.5 + r], outline=(255, 255, 255, 22), width=6)
        d.line([0, H * 0.5, W, H * 0.5], fill=(255, 255, 255, 22), width=6)
    elif th["motif"] == "questions":
        fq = police(FONT_TITRE, 90)
        for j, y in enumerate(range(60, H, 210)):
            for i, x in enumerate(range(60 + (j % 2) * 120, W, 240)):
                d.text((x, y), "?", font=fq, fill=(255, 255, 255, 13), anchor="mm")
    else:
        for x in range(30, W, 60):
            for y in range(30, H, 60):
                d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(255, 255, 255, 20))
    # grand chrono en filigrane
    chrono(d, W * 0.86, H * 0.9, 300, (255, 255, 255, 8), angle=-60, epaisseur=26)
    return im


# ---------------------------------------------------------------- écrans
Y_LOGO, Y_THEME = 105, 196
CARTE = (60, 260, W - 60, 700)
Y_PAUSE, TIMER = 748, (540, 905, 92)
Y_CHOIX, H_BOITE, ECART = 1070, 120, 28


def boites():
    return [(80, Y_CHOIX + i * (H_BOITE + ECART), W - 80, Y_CHOIX + i * (H_BOITE + ECART) + H_BOITE)
            for i in range(4)]


def entete(d, ep, iq):
    th = THEMES[ep["theme"]]
    logo(d, W / 2, Y_LOGO, 64)
    f = police(FONT_TEXTE, 30)
    pastille(d, W / 2, Y_THEME, f"{th['nom']}  ·  ÉPISODE {ep['numero']:02d}", f, th["accent"], SOMBRE, h=50)
    # barre de progression : un segment par question
    n = len(ep["questions"])
    larg, esp = 120, 14
    x0 = W / 2 - (n * larg + (n - 1) * esp) / 2
    for i in range(n):
        c = th["accent"] if i < iq else (BLANC if i == iq else (255, 255, 255, 50))
        d.rounded_rectangle([x0 + i * (larg + esp), 236, x0 + i * (larg + esp) + larg, 246], radius=5, fill=c)


def carte_question(d, ep, iq):
    q = ep["questions"][iq]
    x0, y0, x1, y1 = CARTE
    d.rounded_rectangle([x0, y0 + 30, x1, y1], radius=40, fill=NUIT + (150,))
    fn = police(FONT_TEXTE, 32)
    lab, coul = NIVEAUX[q.get("niveau", "moyen")]
    num = f"QUESTION {iq + 1}/{len(ep['questions'])}"
    w1 = d.textlength(num, font=fn) + 52
    w2 = d.textlength(lab, font=fn) + 52
    xa = W / 2 - (w1 + 16 + w2) / 2
    pastille(d, xa + w1 / 2, y0 + 80, num, fn, (255, 255, 255, 40), BLANC, h=56)
    pastille(d, xa + w1 + 16 + w2 / 2, y0 + 80, lab, fn, coul, BLANC, h=56)
    taille = 64
    while True:
        fq = police(FONT_TEXTE, taille)
        lignes = couper(q["question"], fq, x1 - x0 - 90, d)
        if len(lignes) * taille * 1.2 <= (y1 - y0) - 150 or taille <= 44:
            break
        taille -= 4
    hb = len(lignes) * taille * 1.2
    texte_centre(d, lignes, fq, W / 2, y0 + 120 + ((y1 - y0 - 120) - hb) / 2, BLANC, 1.2)


def dessiner_choix(d, ep, iq, etat, apparition):
    q = ep["questions"][iq]
    accent = THEMES[ep["theme"]]["accent"]
    fl = police(FONT_TITRE, 54)
    for i, (x0, y0, x1, y1) in enumerate(boites()):
        p = min(1.0, max(0.0, apparition * 4 - i))
        if p <= 0:
            continue
        dx = int((1 - p) ** 2 * 140)
        x0, x1 = x0 + dx, x1 + dx
        bonne = i == q["reponse"]
        if etat == "revele" and bonne:
            c_fond, c_txt, c_badge, c_lettre = VERT + (255,), BLANC, BLANC, VERT
        elif etat == "revele":
            c_fond, c_txt, c_badge, c_lettre = (255, 255, 255, 60), (255, 255, 255, 130), (0, 0, 0, 60), (255, 255, 255, 130)
        else:
            c_fond, c_txt, c_badge, c_lettre = (255, 255, 255, int(255 * p)), SOMBRE, accent, SOMBRE
        rayon = (y1 - y0) // 2
        if etat != "revele":  # ombre portée
            d.rounded_rectangle([x0, y0 + 8, x1, y1 + 8], radius=rayon, fill=(0, 0, 0, int(70 * p)))
        if etat == "revele" and bonne:
            d.rounded_rectangle([x0 - 9, y0 - 9, x1 + 9, y1 + 9], radius=rayon + 9, outline=BLANC, width=6)
        d.rounded_rectangle([x0, y0, x1, y1], radius=rayon, fill=c_fond)
        r = rayon - 14
        bx, by = x0 + 14 + r, (y0 + y1) / 2
        d.ellipse([bx - r, by - r, bx + r, by + r], fill=c_badge)
        d.text((bx, by), LETTRES[i], font=fl, fill=c_lettre, anchor="mm")
        txt, tx, taille = q["choix"][i], bx + r + 30, 54
        while d.textlength(txt, font=police(FONT_TEXTE, taille)) > x1 - tx - 90 and taille > 28:
            taille -= 2
        d.text((tx, by), txt, font=police(FONT_TEXTE, taille), fill=c_txt, anchor="lm")
        if etat == "revele" and bonne:
            fx = x1 - 72
            d.line([fx - 24, by, fx - 6, by + 20, fx + 28, by - 22], fill=BLANC, width=11, joint="curve")


def pied(d):
    d.text((W / 2, 1700), PSEUDO, font=police(FONT_TEXTE, 34), fill=(255, 255, 255, 110), anchor="mm")


def image_question(base, ep, iq, etat, apparition=1.0):
    im = base.copy()
    d = Dessin(im)
    entete(d, ep, iq + (1 if etat == "revele" else 0))
    carte_question(d, ep, iq)
    dessiner_choix(d, ep, iq, etat, apparition)
    pied(d)
    return im


def dessiner_timer(im, reste, accent):
    d = Dessin(im)
    cx, cy, r = TIMER
    couleur = ROUGE if reste <= 1.5 else JAUNE
    chrono(d, cx, cy, r, couleur, aiguille=False, fond=NUIT + (230,), epaisseur=10)
    frac = max(0.0, reste / DUREE_COMPTE)
    d.arc([cx - r + 18, cy - r + 18, cx + r - 18, cy + r - 18], -90, -90 + 360 * frac, fill=couleur, width=14)
    n = str(max(1, math.ceil(reste)))
    fr = reste % 1 or 1
    f = police(FONT_TITRE, int(r * 1.0 * (1 + 0.15 * (fr ** 6))))
    d.text((cx, cy + 4), n, font=f, fill=BLANC, anchor="mm")


def dessiner_pause(im, texte, cy=Y_PAUSE):
    d = Dessin(im)
    f = police(FONT_TEXTE, 36)
    h, icone = 62, 26
    w = d.textlength(texte, font=f)
    larg = w + icone + 24 + 56
    x0 = W / 2 - larg / 2
    d.rounded_rectangle([x0, cy - h / 2, x0 + larg, cy + h / 2], radius=h / 2, fill=NUIT + (190,))
    ix, bw = x0 + 28, icone * 0.32
    d.rectangle([ix, cy - icone / 2, ix + bw, cy + icone / 2], fill=JAUNE)
    d.rectangle([ix + icone - bw, cy - icone / 2, ix + icone, cy + icone / 2], fill=JAUNE)
    d.text((ix + icone + 18, cy), texte, font=f, fill=BLANC, anchor="lm")


def image_intro(base, ep, t):
    th = THEMES[ep["theme"]]
    im = base.copy()
    d = Dessin(im)
    p = min(1.0, t / 0.4)
    ech = 1 + 0.5 * (1 - p) ** 3
    r = 150 * ech
    cy = 640
    angle = -90 + 360 * min(1.0, t / 1.2) * 2  # l'aiguille fait deux tours
    chrono(d, W / 2, cy, r, JAUNE + (int(255 * p),), angle=angle, fond=NUIT + (int(200 * p),), epaisseur=24)
    if t > 0.35:
        q = min(1.0, (t - 0.35) / 0.3)
        f = police(FONT_TITRE, 150)
        y = cy + 300 + (1 - q) * 40
        d.text((W / 2, y), "CHRONO", font=f, fill=BLANC + (int(255 * q),), anchor="mm")
        d.text((W / 2, y + 150), "QUIZ", font=f, fill=JAUNE + (int(255 * q),), anchor="mm")
    if t > 0.8:
        q = min(1.0, (t - 0.8) / 0.25)
        pastille(d, W / 2, 1300 + (1 - q) * 30, f"SPÉCIAL {th['nom']}", police(FONT_TITRE, 56),
                 th["accent"] + (int(255 * q),), SOMBRE + (int(255 * q),), pad=40, h=96)
    if t > 1.3:
        q = min(1.0, (t - 1.3) / 0.3)
        fp = police(FONT_TEXTE, 56)
        texte_centre(d, couper(ep["accroche"], fp, W - 180, d), fp, W / 2, 1400 + (1 - q) * 30,
                     BLANC + (int(255 * q),), 1.25)
    return im


def image_fin(base, ep, t):
    im = base.copy()
    d = Dessin(im)
    logo(d, W / 2, 300, 80)
    p = min(1.0, t / 0.35)
    f = police(FONT_TITRE, int(170 * (1 + 0.3 * (1 - p) ** 3)))
    d.text((W / 2, 680), "TON SCORE ?", font=f, fill=JAUNE, anchor="mm")
    fp = police(FONT_TEXTE, 58)
    texte_centre(d, ["Écris-le en commentaire", f"(sur {len(ep['questions'])})"], fp, W / 2, 800, BLANC, 1.3)
    if t > 0.6:
        q = min(1.0, (t - 0.6) / 0.25)
        fa = police(FONT_TITRE, 64)
        w = d.textlength("ABONNE-TOI", font=fa) + 120
        cy = 1130 + (1 - q) * 30
        d.rounded_rectangle([W / 2 - w / 2, cy - 60, W / 2 + w / 2, cy + 60], radius=60, fill=ROUGE + (int(255 * q),))
        d.text((W / 2, cy), "ABONNE-TOI", font=fa, fill=BLANC + (int(255 * q),), anchor="mm")
        texte_centre(d, ["Un nouveau quiz chaque jour"], police(FONT_TEXTE, 44), W / 2, 1220,
                     (255, 255, 255, int(200 * q)))
    pied(d)
    return im


# ---------------------------------------------------------------- montage
def publication(ep):
    th = THEMES[ep["theme"]].get("court", THEMES[ep["theme"]]["nom"].lower())
    tags = {"foot": "#foot #football #quizfoot", "logique": "#logique #enigme #cassetete",
            "culture": "#culturegenerale #culture #quizculture"}[ep["theme"]]
    return (f"TITRE :\n{ep.get('titre_youtube', ep['accroche'])} #shorts\n\n"
            f"DESCRIPTION :\n{ep['accroche']}\nQuiz {th} n°{ep['numero']} : {len(ep['questions'])} questions, "
            f"de facile à difficile, {DUREE_COMPTE} secondes pour répondre.\n"
            f"Écris ton score en commentaire et abonne-toi à Chrono Quiz pour un nouveau quiz chaque jour !\n\n"
            f"{tags} #quiz #chronoquiz #shorts\n")


def generer(chemin):
    ep = json.load(open(chemin, encoding="utf-8"))
    th = THEMES[ep["theme"]]
    base = fond(ep["theme"])
    segments = []  # (durée, image(t), [(décalage, son)])

    bienvenue = ep.get("bienvenue", f"Bienvenue dans Chrono Quiz ! Spécial {th.get('court', th['nom'].lower())}.")
    v = tts(bienvenue + " " + ep["accroche"])
    segments.append((max(2.6, len(v) / SR + 0.3), lambda t: image_intro(base, ep, t),
                     [(0.0, son_whoosh()), (0.3, v)]))

    pause_q = ep.get("pause_par_question", False)
    v_pause = tts(ep.get("pause", "Besoin de réfléchir ? Mets pause !")) if pause_q else None
    tic, tic2, ding = son_tic(), son_tic(True), son_bonne_reponse()

    for iq, q in enumerate(ep["questions"]):
        v = tts(q["question"])
        sons, d_pose = [(0.15, v)], len(v) / SR + 0.4
        if v_pause is not None:
            sons.append((d_pose, v_pause))
            d_pose += len(v_pause) / SR + 0.2
        segments.append((d_pose, lambda t, _iq=iq: image_question(base, ep, _iq, "pose", min(1, t / 0.9)), sons))

        statique = image_question(base, ep, iq, "pose")
        if pause_q:
            dessiner_pause(statique, "Besoin de réfléchir ? Mets pause")

        def compte(t, _s=statique):
            im = _s.copy()
            dessiner_timer(im, DUREE_COMPTE - t, th["accent"])
            return im
        segments.append((DUREE_COMPTE, compte,
                         [(k, tic2 if k == DUREE_COMPTE - 1 else tic) for k in range(DUREE_COMPTE)]))

        phrase = f"Réponse {LETTRES[q['reponse']]} : {q['choix'][q['reponse']]} !"
        if q.get("explication"):
            phrase += " " + q["explication"]
        v2 = tts(phrase)
        revele = image_question(base, ep, iq, "revele")
        segments.append((len(v2) / SR + 0.8, lambda t, _r=revele: _r, [(0.0, ding), (0.35, v2)]))

    vf = tts(ep.get("fin", "Alors, combien de bonnes réponses ? Écris ton score en commentaire et abonne-toi "
                           "à Chrono Quiz pour le prochain quiz !"))
    segments.append((len(vf) / SR + 1.0, lambda t: image_fin(base, ep, t), [(0.2, vf)]))

    total = sum(s[0] for s in segments)
    audio = np.zeros(int(total * SR) + SR, dtype=np.float32)
    t0 = 0.0
    for duree, _, sons in segments:
        for dec, s in sons:
            a = int((t0 + dec) * SR)
            audio[a:a + len(s)] += s[: len(audio) - a]
        t0 += duree
    audio = np.clip(audio, -1, 1)

    os.makedirs(SORTIE, exist_ok=True)
    nom = os.path.splitext(os.path.basename(chemin))[0]
    brut = os.path.join(CACHE, nom + ".f32")
    audio.tofile(brut)
    mp4 = os.path.join(SORTIE, nom + ".mp4")
    ff = subprocess.Popen([
        "ffmpeg", "-y", "-v", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", brut,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", mp4,
    ], stdin=subprocess.PIPE)
    for duree, fn, _ in segments:
        for k in range(int(round(duree * FPS))):
            ff.stdin.write(fn(k / FPS).convert("RGB").tobytes())
    ff.stdin.close()
    ff.wait()
    with open(os.path.join(SORTIE, nom + "_publication.txt"), "w", encoding="utf-8") as f:
        f.write(publication(ep))
    print(f"{mp4}  ({total:.1f} s)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("fichiers", nargs="*")
    ap.add_argument("--tous", action="store_true")
    args = ap.parse_args()
    fichiers = sorted(glob.glob(os.path.join(EPISODES, "*.json"))) if args.tous else args.fichiers
    for f in fichiers:
        generer(f)


if __name__ == "__main__":
    main()
