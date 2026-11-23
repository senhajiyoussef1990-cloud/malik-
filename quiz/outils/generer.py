#!/usr/bin/env python3
"""Génère une vidéo de quiz (Short vertical ou vidéo longue horizontale).

Usage :
    python3 quiz/outils/generer.py quiz/questions/foot_01.json            # Short 1080x1920
    python3 quiz/outils/generer.py quiz/questions/foot_01.json --long     # Vidéo 1920x1080

La voix off est générée avec edge-tts (gratuit) ou ElevenLabs, mise en cache dans quiz/cache/.
La vidéo sort dans quiz/sortie/.
"""
import argparse
import hashlib
import json
import math
import os
import subprocess
import sys
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
CACHE = os.path.join(RACINE, "cache")
SORTIE = os.path.join(RACINE, "sortie")
FONT_TITRE = os.path.join(RACINE, "fonts", "oswald-latin-700-normal.ttf")
FONT_TEXTE = os.path.join(RACINE, "fonts", "inter-latin-700-normal.ttf")

FPS = 30
SR = 44100
VOIX_ID = os.environ.get("QUIZ_VOIX", "GPAQQPp9dazaB2bl4zg9")  # Victor (français)
MODELE = "eleven_multilingual_v2"
VOIX_EDGE = os.environ.get("QUIZ_VOIX_EDGE", "fr-FR-RemyMultilingualNeural")

THEMES = {
    "foot": {"haut": (8, 60, 30), "bas": (18, 110, 52), "accent": (250, 204, 21), "lignes": True},
    "logique": {"haut": (30, 16, 70), "bas": (60, 40, 140), "accent": (34, 211, 238), "lignes": False},
}
VERT = (34, 197, 94)
ROUGE = (239, 68, 68)
BLANC = (255, 255, 255)
SOMBRE = (17, 24, 39)
LETTRES = "ABCD"


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
    corps = json.dumps({
        "text": texte,
        "model_id": MODELE,
        "voice_settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35},
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOIX_ID}",
        data=corps,
        headers={"Content-Type": "application/json", "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "x"),
                 "Accept": "audio/mpeg"},
    )
    with urllib.request.urlopen(req, timeout=120) as r, open(mp3, "wb") as f:
        f.write(r.read())


def tts(texte):
    """Voix off : edge-tts (gratuit) par défaut, ElevenLabs avec QUIZ_TTS=eleven."""
    os.makedirs(CACHE, exist_ok=True)
    moteur = os.environ.get("QUIZ_TTS", "edge")
    voix = VOIX_ID if moteur == "eleven" else VOIX_EDGE
    cle = hashlib.sha1(f"{moteur}|{voix}|{texte}".encode()).hexdigest()[:16]
    mp3 = os.path.join(CACHE, cle + ".mp3")
    if not os.path.exists(mp3):
        (_eleven if moteur == "eleven" else _edge)(texte, mp3)
    brut = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                          capture_output=True, check=True).stdout
    return np.frombuffer(brut, dtype=np.float32)


def son_tic():
    t = np.arange(int(SR * 0.06)) / SR
    return (0.35 * np.sin(2 * np.pi * 1200 * t) * np.exp(-t * 60)).astype(np.float32)


def son_whoosh():
    n = int(SR * 0.45)
    t = np.arange(n) / SR
    bruit = np.random.default_rng(1).standard_normal(n)
    env = np.sin(np.pi * t / t[-1]) ** 2
    lisse = np.convolve(bruit, np.ones(12) / 12, mode="same")
    return (0.25 * lisse * env).astype(np.float32)


def son_bonne_reponse():
    sortie = np.zeros(int(SR * 0.7), dtype=np.float32)
    for i, f in enumerate([880, 1320]):
        t = np.arange(int(SR * 0.45)) / SR
        note = 0.3 * np.sin(2 * np.pi * f * t) * np.exp(-t * 6)
        d = int(i * 0.12 * SR)
        sortie[d:d + len(note)] += note
    return sortie


# ---------------------------------------------------------------- dessin
def police(chemin, taille):
    return ImageFont.truetype(chemin, taille)


def couper(texte, fnt, largeur, draw):
    mots, lignes, cur = texte.split(), [], ""
    for m in mots:
        essai = (cur + " " + m).strip()
        if draw.textlength(essai, font=fnt) <= largeur:
            cur = essai
        else:
            lignes.append(cur)
            cur = m
    if cur:
        lignes.append(cur)
    return lignes


def texte_centre(draw, lignes, fnt, cx, y, couleur, interligne=1.18):
    h = fnt.size * interligne
    for i, l in enumerate(lignes):
        w = draw.textlength(l, font=fnt)
        draw.text((cx - w / 2, y + i * h), l, font=fnt, fill=couleur)
    return y + len(lignes) * h


def fond(W, H, theme):
    th = THEMES[theme]
    a = np.linspace(0, 1, H)[:, None, None]
    img = (np.array(th["haut"]) * (1 - a) + np.array(th["bas"]) * a).astype(np.uint8)
    img = np.repeat(img, W, axis=1)
    im = Image.fromarray(img, "RGB")
    d = ImageDraw.Draw(im, "RGBA")
    if th["lignes"]:  # bandes de pelouse + rond central
        for i in range(0, H, H // 10):
            if (i // (H // 10)) % 2 == 0:
                d.rectangle([0, i, W, i + H // 10], fill=(255, 255, 255, 10))
        r = min(W, H) * 0.32
        d.ellipse([W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r], outline=(255, 255, 255, 28), width=6)
        d.line([0, H / 2, W, H / 2], fill=(255, 255, 255, 28), width=6)
    else:  # petits points façon grille
        for x in range(0, W, 60):
            for y in range(0, H, 60):
                d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(255, 255, 255, 22))
    return im


class Mise:
    """Positions des éléments selon le format."""

    def __init__(self, long):
        self.long = long
        if long:
            self.W, self.H = 1920, 1080
            self.titre_y, self.titre_t = 40, 70
            self.q_y, self.q_t, self.q_l = 150, 62, 1700
            self.timer = (960, 400, 92)
            self.grille = "2x2"
            self.boite_h, self.choix_t = 150, 52
            self.choix_y = 560
        else:
            self.W, self.H = 1080, 1920
            self.titre_y, self.titre_t = 170, 96
            self.q_y, self.q_t, self.q_l = 420, 66, 920
            self.timer = (540, 900, 95)
            self.grille = "1x4"
            self.boite_h, self.choix_t = 120, 54
            self.choix_y = 1060


def boites(m):
    if m.grille == "1x4":
        x0, x1 = 80, m.W - 80
        return [(x0, m.choix_y + i * (m.boite_h + 28), x1, m.choix_y + i * (m.boite_h + 28) + m.boite_h)
                for i in range(4)]
    out = []
    larg = (m.W - 3 * 70) // 2
    for i in range(4):
        c, r = i % 2, i // 2
        x0 = 70 + c * (larg + 70)
        y0 = m.choix_y + r * (m.boite_h + 50)
        out.append((x0, y0, x0 + larg, y0 + m.boite_h))
    return out


def dessiner_entete(d, m, data, num, total):
    th = THEMES[data["theme"]]
    ft = police(FONT_TITRE, m.titre_t)
    titre = data["titre"]
    if m.long:
        d.text((70, m.titre_y), titre, font=ft, fill=th["accent"])
    else:
        w = d.textlength(titre, font=ft)
        d.text((m.W / 2 - w / 2, m.titre_y), titre, font=ft, fill=th["accent"])
    if num:
        fp = police(FONT_TEXTE, 38)
        lab = f"QUESTION {num}/{total}"
        w = d.textlength(lab, font=fp)
        if m.long:
            x, y = m.W - 70 - w - 40, m.titre_y + 14
        else:
            x, y = m.W / 2 - w / 2 - 20, m.titre_y + m.titre_t + 40
        d.rounded_rectangle([x, y, x + w + 40, y + 62], radius=31, fill=(0, 0, 0, 90))
        d.text((x + 20, y + 9), lab, font=fp, fill=BLANC)


def image_question(m, data, iq, etat, apparition=1.0):
    """etat : 'pose' ou 'revele'. apparition : 0..1 pour l'arrivée des choix."""
    q = data["questions"][iq]
    im = BASE.copy()
    d = ImageDraw.Draw(im, "RGBA")
    dessiner_entete(d, m, data, iq + 1, len(data["questions"]))
    fq = police(FONT_TEXTE, m.q_t)
    lignes = couper(q["question"], fq, m.q_l, d)
    cx = m.W / 2
    texte_centre(d, lignes, fq, cx, m.q_y, BLANC)

    fc = police(FONT_TEXTE, m.choix_t)
    fl = police(FONT_TITRE, m.choix_t)
    for i, (x0, y0, x1, y1) in enumerate(boites(m)):
        p = min(1.0, max(0.0, apparition * 4 - i))  # apparition décalée
        if p <= 0:
            continue
        dx = int((1 - p) ** 2 * 120)
        bonne = i == q["reponse"]
        if etat == "revele" and bonne:
            fond_c, txt_c, badge, badge_txt = VERT + (255,), BLANC, BLANC, VERT
        elif etat == "revele":
            fond_c, txt_c, badge, badge_txt = (255, 255, 255, 70), (255, 255, 255, 140), (0, 0, 0, 60), (255, 255, 255, 140)
        else:
            fond_c, txt_c, badge, badge_txt = (255, 255, 255, int(255 * p)), SOMBRE, THEMES[data["theme"]]["accent"], SOMBRE
        x0, x1 = x0 + dx, x1 + dx
        if etat == "revele" and bonne:
            d.rounded_rectangle([x0 - 8, y0 - 8, x1 + 8, y1 + 8], radius=(y1 - y0) // 2 + 8, outline=BLANC, width=6)
        d.rounded_rectangle([x0, y0, x1, y1], radius=(y1 - y0) // 2, fill=fond_c)
        r = (y1 - y0) / 2 - 14
        bx, by = x0 + 14 + r, (y0 + y1) / 2
        d.ellipse([bx - r, by - r, bx + r, by + r], fill=badge)
        d.text((bx, by), LETTRES[i], font=fl, fill=badge_txt, anchor="mm")
        txt = q["choix"][i]
        tx = bx + r + 30
        taille = m.choix_t
        while d.textlength(txt, font=police(FONT_TEXTE, taille)) > x1 - tx - 30 and taille > 28:
            taille -= 2
        f2 = police(FONT_TEXTE, taille)
        d.text((tx, by), txt, font=f2, fill=txt_c, anchor="lm")
        if etat == "revele" and bonne:
            fx = x1 - 70
            d.line([fx - 22, by, fx - 6, by + 18, fx + 26, by - 20], fill=BLANC, width=10, joint="curve")
    return im


def dessiner_timer(im, m, reste, total, accent):
    d = ImageDraw.Draw(im, "RGBA")
    cx, cy, r = m.timer
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 0, 0, 110))
    couleur = ROUGE if reste <= 2 else accent
    frac = max(0.0, reste / total)
    d.arc([cx - r + 8, cy - r + 8, cx + r - 8, cy + r - 8], -90, -90 + 360 * frac, fill=couleur, width=16)
    n = str(max(1, math.ceil(reste)))
    pulse = 1 + 0.12 * (1 - (reste % 1 if reste % 1 else 1))
    f = police(FONT_TITRE, int(r * 1.05 * pulse))
    d.text((cx, cy), n, font=f, fill=BLANC, anchor="mm")


def image_intro(m, data, t):
    """Titre qui arrive en grossissant, puis la phrase d'accroche."""
    th = THEMES[data["theme"]]
    im = BASE.copy()
    d = ImageDraw.Draw(im, "RGBA")
    p = min(1.0, t / 0.35)
    echelle = 1 + 0.6 * (1 - p) ** 3
    fg = police(FONT_TITRE, int((170 if not m.long else 150) * echelle))
    cy = m.H / 2 - (150 if not m.long else 90)
    lignes = couper(data["titre"], fg, m.W - 120, d)
    h = len(lignes) * fg.size * 1.05
    y = texte_centre(d, lignes, fg, m.W / 2, cy - h / 2, th["accent"] + (int(255 * p),), 1.05)
    # trait sous le titre
    if t > 0.3:
        q = min(1.0, (t - 0.3) / 0.25)
        lw = 260 * q
        d.rounded_rectangle([m.W / 2 - lw, y + fg.size * 0.5, m.W / 2 + lw, y + fg.size * 0.5 + 14], radius=7, fill=BLANC)
    if t > 0.55:
        q = min(1.0, (t - 0.55) / 0.3)
        fp = police(FONT_TEXTE, 66 if not m.long else 58)
        lp = couper(data["accroche"], fp, m.W - 180, d)
        texte_centre(d, lp, fp, m.W / 2, y + fg.size * 0.5 + 70 + (1 - q) * 40, (255, 255, 255, int(255 * q)), 1.25)
    return im


PAUSE_COURT = "Besoin de réfléchir ? Mets pause"
PAUSE_LONG = "Besoin de réfléchir ? Mets pause"


def dessiner_pause(im, m, texte, cy=None):
    """Bandeau « mets pause » avec l'icône pause, pendant le compte à rebours."""
    d = ImageDraw.Draw(im, "RGBA")
    f = police(FONT_TEXTE, 40 if not m.long else 36)
    w = d.textlength(texte, font=f)
    h = 66 if not m.long else 60
    icone = h * 0.42
    larg = w + icone + 26 + 56
    if cy is None:
        cy = 735 if not m.long else 40 + h / 2 + 8
    x0 = m.W / 2 - larg / 2
    d.rounded_rectangle([x0, cy - h / 2, x0 + larg, cy + h / 2], radius=h // 2, fill=(0, 0, 0, 120))
    ix = x0 + 28
    bw = icone * 0.32
    d.rectangle([ix, cy - icone / 2, ix + bw, cy + icone / 2], fill=BLANC)
    d.rectangle([ix + icone - bw, cy - icone / 2, ix + icone, cy + icone / 2], fill=BLANC)
    d.text((ix + icone + 18, cy), texte, font=f, fill=BLANC, anchor="lm")


def image_texte(m, data, gros, petit, accent_gros=True, extra=None):
    im = BASE.copy()
    d = ImageDraw.Draw(im, "RGBA")
    fg = police(FONT_TITRE, 150 if not m.long else 140)
    fp = police(FONT_TEXTE, 64 if not m.long else 56)
    lg = couper(gros, fg, m.W - 160, d)
    lp = couper(petit, fp, m.W - 200, d)
    h = len(lg) * fg.size * 1.1 + 60 + len(lp) * fp.size * 1.25
    y = m.H / 2 - h / 2 - (80 if not m.long else 0)
    y = texte_centre(d, lg, fg, m.W / 2, y, THEMES[data["theme"]]["accent"] if accent_gros else BLANC, 1.1)
    y = texte_centre(d, lp, fp, m.W / 2, y + 60, BLANC, 1.25)
    if extra:
        dessiner_pause(im, m, extra, cy=y + 90)
    return im


# ---------------------------------------------------------------- montage
def main():
    global BASE
    ap = argparse.ArgumentParser()
    ap.add_argument("fichier")
    ap.add_argument("--long", action="store_true", help="format horizontal 1920x1080")
    args = ap.parse_args()
    data = json.load(open(args.fichier, encoding="utf-8"))
    m = Mise(args.long)
    BASE = fond(m.W, m.H, data["theme"])
    accent = THEMES[data["theme"]]["accent"]
    duree_compte = 8 if args.long else 4

    segments = []  # (durée, fonction_image(t), [(décalage, son)])
    # Intro rapide : « Bienvenue dans le quiz… » + une phrase qui accroche, puis on enchaîne.
    bienvenue = data.get("bienvenue", f"Bienvenue dans le {data['titre'].lower()} !")
    voix = tts(bienvenue + " " + data["accroche"])
    d_intro = len(voix) / SR + 0.3
    segments.append((d_intro, lambda t: image_intro(m, data, t), [(0.0, son_whoosh()), (0.25, voix)]))

    pause_question = data.get("pause_par_question", False)
    phrase_pause = data.get("pause", "Besoin de réfléchir ? Mets pause !")
    voix_pause = tts(phrase_pause) if pause_question else None
    statique_pause = PAUSE_COURT if not args.long else PAUSE_LONG

    tic, ding = son_tic(), son_bonne_reponse()
    for iq, q in enumerate(data["questions"]):
        texte_voix = q["question"]
        if args.long:
            texte_voix += " " + " ; ".join(f"{LETTRES[i]} : {c}" for i, c in enumerate(q["choix"]))
        v = tts(texte_voix)
        sons = [(0.15, v)]
        d_pose = len(v) / SR + 0.4
        if voix_pause is not None:
            sons.append((d_pose, voix_pause))
            d_pose += len(voix_pause) / SR + 0.2
        segments.append((d_pose, lambda t, _iq=iq: image_question(m, data, _iq, "pose", min(1, t / 0.9)), sons))
        statique = image_question(m, data, iq, "pose")

        def compte(t, _s=statique):
            im = _s.copy()
            if pause_question:
                dessiner_pause(im, m, statique_pause)
            dessiner_timer(im, m, duree_compte - t, duree_compte, accent)
            return im
        segments.append((duree_compte, compte, [(k, tic) for k in range(duree_compte)]))

        bonne = q["choix"][q["reponse"]]
        phrase = f"Réponse {LETTRES[q['reponse']]} : {bonne} !"
        if q.get("explication"):
            phrase += " " + q["explication"]
        v2 = tts(phrase)
        revele = image_question(m, data, iq, "revele")
        segments.append((len(v2) / SR + 0.9, lambda t, _r=revele: _r, [(0.0, ding), (0.35, v2)]))

    vf = tts(data["fin"])
    segments.append((len(vf) / SR + 1.2,
                     lambda t, _i=image_texte(m, data, "TON SCORE ?", "Écris-le en commentaire et abonne-toi !"): _i,
                     [(0.2, vf)]))

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
    nom = os.path.splitext(os.path.basename(args.fichier))[0] + ("_long" if args.long else "_short")
    wav = os.path.join(CACHE, nom + ".f32")
    audio.tofile(wav)
    mp4 = os.path.join(SORTIE, nom + ".mp4")
    ff = subprocess.Popen([
        "ffmpeg", "-y", "-v", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{m.W}x{m.H}", "-r", str(FPS), "-i", "-",
        "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", wav,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", mp4,
    ], stdin=subprocess.PIPE)
    for duree, fn, _ in segments:
        n = int(round(duree * FPS))
        for k in range(n):
            ff.stdin.write(fn(k / FPS).convert("RGB").tobytes())
    ff.stdin.close()
    ff.wait()
    print(f"{mp4}  ({total:.1f} s)")


if __name__ == "__main__":
    main()
