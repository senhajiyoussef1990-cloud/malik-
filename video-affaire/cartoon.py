#!/usr/bin/env python3
"""Dessin animé années 30 généré en code (style « rubber hose », N&B + rouge).

Usage : python3 cartoon.py [n01 n02 ...]   -> clips/<id>.mp4 (1080x608, 12 i/s)
La durée de chaque clip suit audio/<id>.mp3 (sinon 6 s).
"""
import math, os, subprocess, sys, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
W, H, FPS, SS = 1080, 608, 12, 2          # SS = suréchantillonnage (anticrénelage)
FT = os.path.join(ROOT, "fonts/oswald-latin-700-normal.ttf")
INK, PAPER, RED = (18, 18, 18), (238, 236, 230), (200, 30, 30)
G1, G2, G3, G4 = (205, 203, 197), (165, 163, 158), (110, 108, 104), (60, 59, 57)
_fonts = {}
def F(sz):
    if sz not in _fonts: _fonts[sz] = ImageFont.truetype(FT, int(sz * SS))
    return _fonts[sz]

# ---------------- primitives (coordonnées logiques 1080x608) ----------------
class Pen:
    def __init__(self, d): self.d = d
    def s(self, v): return v * SS
    def ell(self, cx, cy, rx, ry, fill=PAPER, ol=INK, w=5):
        self.d.ellipse([self.s(cx - rx), self.s(cy - ry), self.s(cx + rx), self.s(cy + ry)], fill=fill,
                       outline=ol, width=int(w * SS) if ol else 0)
    def poly(self, pts, fill=PAPER, ol=INK, w=5):
        p = [(self.s(x), self.s(y)) for x, y in pts]
        self.d.polygon(p, fill=fill)
        if ol: self.d.line(p + [p[0]], fill=ol, width=int(w * SS), joint="curve")
    def line(self, pts, col=INK, w=5):
        p = [(self.s(x), self.s(y)) for x, y in pts]
        self.d.line(p, fill=col, width=int(w * SS), joint="curve")
        r = w * SS / 2
        for x, y in (p[0], p[-1]): self.d.ellipse([x - r, y - r, x + r, y + r], fill=col)
    def rect(self, x0, y0, x1, y1, fill=PAPER, ol=INK, w=5, r=0):
        b = [self.s(x0), self.s(y0), self.s(x1), self.s(y1)]
        if r: self.d.rounded_rectangle(b, int(r * SS), fill=fill, outline=ol, width=int(w * SS) if ol else 0)
        else: self.d.rectangle(b, fill=fill, outline=ol, width=int(w * SS) if ol else 0)
    def text(self, x, y, t, sz, col=INK, anchor="mm", stroke=0, sc=PAPER):
        self.d.text((self.s(x), self.s(y)), t, font=F(sz), fill=col, anchor=anchor,
                    stroke_width=int(stroke * SS), stroke_fill=sc)
    def arc(self, cx, cy, rx, ry, a0, a1, col=INK, w=5):
        self.d.arc([self.s(cx - rx), self.s(cy - ry), self.s(cx + rx), self.s(cy + ry)], a0, a1, fill=col, width=int(w * SS))
    def pie(self, cx, cy, rx, ry, a0, a1, fill):
        self.d.pieslice([self.s(cx - rx), self.s(cy - ry), self.s(cx + rx), self.s(cy + ry)], a0, a1, fill=fill)

def bez(p0, p1, p2, n=14):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in (i / n for i in range(n + 1))]

def hose(p, a, b, bend=20, w=9):
    """membre « tuyau d'arrosage » : courbe souple de a à b"""
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1
    c = (mx - dy / L * bend, my + dx / L * bend)
    p.line(bez(a, c, b), INK, w)

def glove(p, x, y, r=15):
    p.ell(x, y, r, r * 0.9, PAPER, INK, 4)
    for k in (-1, 0, 1): p.line([(x + k * r * 0.35, y - r * 0.2), (x + k * r * 0.35, y + r * 0.45)], INK, 2)
    p.rect(x - r * 0.7, y + r * 0.7, x + r * 0.7, y + r * 1.05, PAPER, INK, 3)

def shoe(p, x, y, dirx=1):
    p.ell(x + dirx * 10, y, 24, 12, INK, None)
    p.ell(x + dirx * 16, y - 4, 7, 4, (90, 90, 90), None)

def eyes(p, cx, cy, kind="happy", look=(0, 0), sz=1.0, t=0):
    for side in (-1, 1):
        ex = cx + side * 17 * sz; rx, ry = 13 * sz, 19 * sz
        if kind == "hearts":
            s = 1 + 0.15 * math.sin(t * 10)
            heart(p, ex, cy, 15 * sz * s)
            continue
        p.ell(ex, cy, rx, ry, PAPER, INK, 3.5)
        if kind == "spin":
            a = t * 600 + side * 90
            p.line([(ex + math.cos(math.radians(a + k * 30)) * k * 1.3 * sz, cy + math.sin(math.radians(a + k * 30)) * k * 1.3 * sz) for k in range(12)], INK, 3)
            continue
        px, py = ex + look[0] * 5 * sz, cy + 4 * sz + look[1] * 6 * sz
        p.ell(px, py, 6.5 * sz, 11 * sz, INK, None)
        p.pie(px, py, 6.5 * sz, 11 * sz, 230, 270, PAPER)            # œil « pie-cut »
        if kind == "sly":
            p.pie(ex, cy, rx + 1, ry + 1, 180, 360, G3); p.line([(ex - rx, cy), (ex + rx, cy)], INK, 4)
        if kind == "worried":
            p.line([(ex - rx * side * -0.2 - 10 * sz, cy - ry - 6 * sz - side * -4), (ex + 10 * sz, cy - ry - 6 * sz + side * -4)], INK, 4)

def heart(p, x, y, r, col=RED):
    p.ell(x - r * 0.5, y - r * 0.2, r * 0.55, r * 0.55, col, None)
    p.ell(x + r * 0.5, y - r * 0.2, r * 0.55, r * 0.55, col, None)
    p.poly([(x - r * 1.02, y - r * 0.05), (x + r * 1.02, y - r * 0.05), (x, y + r)], col, None)

def sweat(p, x, y, t):
    k = (t * 2) % 1
    p.ell(x, y + k * 30, 6, 9, (210, 225, 235), INK, 2)

# ---------------- personnages ----------------
def sheep(p, x, y, t, s=1.0, expr="happy", arms=None, look=(0, 0), walk=0, bounce=1.0, mouth="smile"):
    """Bêlo : mouton en casquette et nœud papillon rouge"""
    b = math.sin(t * 2 * math.pi * 1.5) * 6 * bounce          # rebond
    by = y - abs(b)
    # jambes
    for side in (-1, 1):
        ph = math.sin(t * 8 + (side > 0) * math.pi) * walk
        hip = (x + side * 22 * s, by + 40 * s); foot = (x + side * 30 * s + ph * 25 * s, y + 120 * s - max(0, ph) * 10)
        hose(p, hip, foot, 10 * side, 10 * s); shoe(p, foot[0], foot[1], side)
    # corps laineux
    pts = [(x + math.cos(a) * 52 * s, by + math.sin(a) * 50 * s) for a in np.linspace(0, 2 * math.pi, 11)[:-1]]
    for cx, cy in pts: p.ell(cx, cy, 25 * s, 25 * s, INK, None)
    for cx, cy in pts: p.ell(cx, cy, 21 * s, 21 * s, PAPER, None)
    p.ell(x, by, 50 * s, 48 * s, PAPER, None)
    # bras
    arms = arms or {}
    for side in (-1, 1):
        sh = (x + side * 44 * s, by - 18 * s)
        hx, hy = arms.get(side, (side * 75, 30))
        hand = (x + hx * s, by + hy * s)
        hose(p, sh, hand, -side * 18, 9 * s); glove(p, hand[0], hand[1], 15 * s)
    # tête
    hy = by - 95 * s
    for side in (-1, 1): p.ell(x + side * 52 * s, hy + 4 * s, 22 * s, 10 * s, G3, INK, 4)     # oreilles
    p.ell(x, hy + 6 * s, 42 * s, 48 * s, G1, INK, 5)                                         # visage
    for k in range(-2, 3): p.ell(x + k * 16 * s, hy - 38 * s + abs(k) * 4, 15 * s, 13 * s, PAPER, INK, 4)  # mèche
    p.poly([(x - 46 * s, hy - 40 * s), (x + 46 * s, hy - 40 * s), (x + 58 * s, hy - 30 * s), (x - 30 * s, hy - 27 * s)], G4, INK, 4)  # visière
    p.ell(x + 4 * s, hy - 54 * s, 46 * s, 20 * s, G4, INK, 4)                                 # casquette
    eyes(p, x, hy + 2 * s, expr, look, 0.95 * s, t)
    p.ell(x, hy + 30 * s, 9 * s, 6 * s, INK, None)                                            # nez
    if mouth == "smile": p.arc(x, hy + 30 * s, 20 * s, 14 * s, 20, 160, INK, 4)
    elif mouth == "o": p.ell(x, hy + 44 * s, 7 * s, 9 * s, INK, None)
    elif mouth == "wavy": p.line([(x - 16 * s + k * 4 * s, hy + 44 * s + (3 if k % 2 else -3) * s) for k in range(9)], INK, 3)
    # nœud papillon rouge
    ny = by - 45 * s
    p.poly([(x, ny), (x - 24 * s, ny - 12 * s), (x - 24 * s, ny + 12 * s)], RED, INK, 3)
    p.poly([(x, ny), (x + 24 * s, ny - 12 * s), (x + 24 * s, ny + 12 * s)], RED, INK, 3)
    p.ell(x, ny, 6 * s, 6 * s, RED, INK, 3)
    return (x, hy)

def fox(p, x, y, t, s=1.0, expr="sly", arms=None, look=(1, 0), grin=True, bounce=0.6):
    """M. Goupil : renard en costume rayé, cravate rouge"""
    b = math.sin(t * 2 * math.pi * 1.2) * 5 * bounce
    by = y - abs(b)
    for side in (-1, 1):
        hip = (x + side * 20 * s, by + 70 * s); foot = (x + side * 28 * s, y + 150 * s)
        hose(p, hip, foot, 8 * side, 10 * s); shoe(p, foot[0], foot[1], side)
    # costume
    p.poly([(x - 50 * s, by - 50 * s), (x + 50 * s, by - 50 * s), (x + 42 * s, by + 80 * s), (x - 42 * s, by + 80 * s)], G4, INK, 5)
    for k in range(-3, 4): p.line([(x + k * 13 * s, by - 46 * s), (x + k * 11 * s, by + 76 * s)], (95, 94, 92), 1.5)
    p.poly([(x - 20 * s, by - 50 * s), (x + 20 * s, by - 50 * s), (x, by + 5 * s)], PAPER, INK, 3)     # chemise
    p.poly([(x - 6 * s, by - 46 * s), (x + 6 * s, by - 46 * s), (x + 9 * s, by - 5 * s), (x, by + 8 * s), (x - 9 * s, by - 5 * s)], RED, INK, 2.5)
    arms = arms or {}
    for side in (-1, 1):
        sh = (x + side * 46 * s, by - 38 * s)
        hx, hy = arms.get(side, (side * 62, 40))
        hand = (x + hx * s, by + hy * s)
        hose(p, sh, hand, -side * 16, 10 * s); glove(p, hand[0], hand[1], 15 * s)
    # tête
    hy = by - 100 * s
    for side in (-1, 1):
        p.poly([(x + side * 22 * s, hy - 30 * s), (x + side * 50 * s, hy - 88 * s), (x + side * 52 * s, hy - 16 * s)], G3, INK, 4)
        p.poly([(x + side * 30 * s, hy - 30 * s), (x + side * 47 * s, hy - 72 * s), (x + side * 47 * s, hy - 26 * s)], INK, None)
    p.poly([(x - 58 * s, hy - 26 * s), (x + 58 * s, hy - 26 * s), (x + 48 * s, hy + 24 * s), (x, hy + 58 * s), (x - 48 * s, hy + 24 * s)], G3, INK, 5)
    p.poly([(x - 40 * s, hy + 10 * s), (x + 40 * s, hy + 10 * s), (x, hy + 58 * s)], PAPER, None)  # museau blanc
    p.ell(x, hy + 50 * s, 10 * s, 7 * s, INK, None)                                            # truffe
    eyes(p, x, hy - 6 * s, expr, look, 0.9 * s, t)
    if grin:
        p.arc(x, hy + 30 * s, 30 * s, 16 * s, 15, 165, INK, 4)
        p.poly([(x - 14 * s, hy + 44 * s), (x - 8 * s, hy + 44 * s), (x - 11 * s, hy + 51 * s)], PAPER, INK, 1.5)
    return (x, hy)

def scientist(p, x, y, t, s=1.0, arms=None, flip=1):
    b = math.sin(t * 6) * 3
    for side in (-1, 1):
        hip = (x + side * 18 * s, y + 30 * s); foot = (x + side * 24 * s, y + 120 * s)
        hose(p, hip, foot, 6 * side, 9 * s); shoe(p, foot[0], foot[1], side)
    p.poly([(x - 40 * s, y - 50 * s + b), (x + 40 * s, y - 50 * s + b), (x + 48 * s, y + 50 * s), (x - 48 * s, y + 50 * s)], PAPER, INK, 5)
    p.line([(x, y - 48 * s + b), (x, y + 48 * s)], INK, 3)
    arms = arms or {}
    for side in (-1, 1):
        sh = (x + side * 38 * s, y - 40 * s + b); hx, hy = arms.get(side, (side * 58, 30))
        hose(p, sh, (x + hx * s, y + hy * s), -side * 14, 9 * s); glove(p, x + hx * s, y + hy * s, 14 * s)
    hy = y - 95 * s + b
    p.ell(x, hy, 38 * s, 44 * s, G1, INK, 5)
    for side in (-1, 1): p.ell(x + side * 38 * s, hy - 2 * s, 12 * s, 16 * s, PAPER, INK, 3)   # touffes
    for side in (-1, 1): p.ell(x + side * 15 * s, hy, 12 * s, 12 * s, PAPER, INK, 3); p.ell(x + side * 15 * s + flip * 3, hy + 2 * s, 4 * s, 5 * s, INK, None)
    p.line([(x - 3 * s, hy), (x + 3 * s, hy)], INK, 3)
    p.ell(x + flip * 4 * s, hy + 16 * s, 8 * s, 6 * s, INK, None)
    p.line([(x - 26 * s, hy + 30 * s), (x - 10 * s, hy + 40 * s), (x + 10 * s, hy + 40 * s), (x + 26 * s, hy + 30 * s)], PAPER, 6)  # moustache
    p.line([(x - 26 * s, hy + 30 * s), (x - 10 * s, hy + 40 * s), (x + 10 * s, hy + 40 * s), (x + 26 * s, hy + 30 * s)], INK, 2)

# ---------------- humains années 30 (remplacent mouton/renard dans le téléphone) ----------------
SKIN = (222, 218, 210)

def tube(p, a, b, col, w, bend=0):
    pts = bez(a, ((a[0] + b[0]) / 2 + bend, (a[1] + b[1]) / 2), b, 10)
    p.line(pts, INK, w + 7); p.line(pts, col, w)

def person(p, x, y, t, s=1.0, kind="ouvrier", expr="happy", arms=None, look=(0, 0), walk=0, bounce=1.0,
           mouth="smile", head_off=105, foot_off=135):
    b = math.sin(t * 2 * math.pi * 1.4) * 5 * bounce
    by = y - abs(b)
    shirt = {"ouvrier": G1, "carreaux": G2, "vendeur": PAPER}[kind]
    pants = {"ouvrier": G3, "carreaux": G4, "vendeur": G4}[kind]
    # ombre au sol
    p.ell(x, y + foot_off * s + 10 * s, 70 * s, 12 * s, (120, 118, 114), None)
    # jambes (pantalon) + chaussures
    for side in (-1, 1):
        ph = math.sin(t * 8 + (side > 0) * math.pi) * walk
        hip = (x + side * 20 * s, by + 40 * s)
        foot = (x + side * 26 * s + ph * 24 * s, y + foot_off * s - 8 * s - max(0, ph) * 8)
        tube(p, hip, foot, pants, 24 * s, side * 4 * s)
        p.ell(foot[0] + side * 10 * s, foot[1] + 10 * s, 30 * s, 14 * s, INK, None)
        p.ell(foot[0] + side * 18 * s, foot[1] + 5 * s, 9 * s, 4 * s, (100, 100, 100), None)
    # buste
    top, bot = by - 58 * s, by + 46 * s
    if kind == "vendeur":
        p.poly([(x - 52 * s, top), (x + 52 * s, top), (x + 46 * s, bot), (x - 46 * s, bot)], G4, INK, 5)
        for k in range(-3, 4): p.line([(x + k * 13 * s, top + 4), (x + k * 12 * s, bot - 4)], (100, 99, 97), 1.6)
        p.poly([(x - 20 * s, top), (x + 20 * s, top), (x, by - 8 * s)], PAPER, INK, 3)
        p.poly([(x - 6 * s, top + 3), (x + 6 * s, top + 3), (x + 9 * s, by - 16 * s), (x, by - 4 * s), (x - 9 * s, by - 16 * s)], RED, INK, 2.5)
        p.ell(x, by + 18 * s, 4 * s, 4 * s, INK, None); p.ell(x, by + 34 * s, 4 * s, 4 * s, INK, None)
    else:
        p.poly([(x - 50 * s, top), (x + 50 * s, top), (x + 46 * s, bot), (x - 46 * s, bot)], shirt, INK, 5)
        if kind == "carreaux":
            for k in range(-3, 4):
                p.line([(x + k * 14 * s, top + 3), (x + k * 13 * s, bot - 3)], G4, 3)
            for k in range(1, 7):
                yy_ = top + k * 15 * s; p.line([(x - 48 * s, yy_), (x + 48 * s, yy_)], G4, 3)
        else:  # salopette
            p.poly([(x - 34 * s, by - 20 * s), (x + 34 * s, by - 20 * s), (x + 44 * s, bot), (x - 44 * s, bot)], G3, INK, 4)
            for side in (-1, 1):
                p.line([(x + side * 28 * s, by - 20 * s), (x + side * 36 * s, top + 2)], G3, 9 * s)
                p.ell(x + side * 26 * s, by - 16 * s, 5 * s, 5 * s, PAPER, INK, 2)
            p.rect(x - 14 * s, by - 6 * s, x + 14 * s, by + 12 * s, G3, INK, 3)
    # bras (manches) + gants
    arms = arms or {}
    sleeve = G4 if kind == "vendeur" else shirt
    for side in (-1, 1):
        sh = (x + side * 46 * s, by - 44 * s)
        hx, hy = arms.get(side, (side * 66, 30))
        hand = (x + hx * s, by + hy * s)
        tube(p, sh, hand, sleeve, 16 * s, -side * 10 * s)
        glove(p, hand[0], hand[1], 16 * s)
    # tête
    hy = by - head_off * s
    for side in (-1, 1): p.ell(x + side * 44 * s, hy + 6 * s, 10 * s, 14 * s, SKIN, INK, 4)
    if kind == "vendeur":
        for side in (-1, 1): p.ell(x + side * 40 * s, hy - 16 * s, 13 * s, 18 * s, INK, None)
    p.ell(x, hy, 44 * s, 50 * s, SKIN, INK, 5)
    if kind in ("ouvrier", "carreaux"):   # barbe de trois jours
        rnd = random.Random(kind)
        for _ in range(22):
            a = rnd.uniform(0.15, 0.85) * math.pi; r = rnd.uniform(0.55, 0.9)
            p.ell(x + math.cos(a) * 38 * s * r, hy + 12 * s + math.sin(a) * 34 * s * r, 1.6 * s, 1.6 * s, G3, None)
    eyes(p, x, hy - 8 * s, expr, look, 0.95 * s, t)
    if expr not in ("hearts", "spin"):
        for side in (-1, 1):   # sourcils
            tilt = {"sly": 5, "worried": -6}.get(expr, 0) * side
            p.line([(x + side * 6 * s, hy - 34 * s + tilt), (x + side * 30 * s, hy - 36 * s - tilt)], INK, 5 * s)
    p.ell(x + look[0] * 4 * s, hy + 16 * s, 17 * s, 13 * s, SKIN, INK, 4)          # gros nez
    p.ell(x + look[0] * 4 * s - 5 * s, hy + 12 * s, 5 * s, 3.5 * s, PAPER, None)
    my = hy + 33 * s
    if kind == "vendeur":
        p.poly([(x - 34 * s, my - 2 * s), (x, my - 8 * s), (x + 34 * s, my - 2 * s), (x + 20 * s, my + 4 * s), (x, my), (x - 20 * s, my + 4 * s)], INK, None)  # moustache
        if mouth != "o": p.arc(x, my + 2 * s, 18 * s, 10 * s, 20, 160, INK, 4)
    if mouth == "smile" and kind != "vendeur": p.arc(x, my - 4 * s, 18 * s, 10 * s, 20, 160, INK, 4)
    elif mouth == "o": p.ell(x, my + 6 * s, 7 * s, 8 * s, INK, None)
    elif mouth == "wavy": p.line([(x - 14 * s + k * 3.5 * s, my + 4 * s + (2.5 if k % 2 else -2.5) * s) for k in range(9)], INK, 3)
    # coiffure / chapeau
    if kind == "ouvrier":
        p.poly([(x - 46 * s, hy - 30 * s), (x + 46 * s, hy - 30 * s), (x + 62 * s, hy - 20 * s), (x - 20 * s, hy - 18 * s)], G4, INK, 4)
        p.ell(x + 2 * s, hy - 44 * s, 46 * s, 22 * s, G4, INK, 4)
        p.ell(x + 2 * s, hy - 64 * s, 5 * s, 4 * s, INK, None)
    elif kind == "carreaux":
        for k in range(-3, 4): p.ell(x + k * 12 * s, hy - 46 * s + abs(k) * 3 * s, 12 * s, 10 * s, INK, None)
    else:  # vendeur : crâne dégarni, reflet sur le crâne
        p.arc(x, hy - 6 * s, 36 * s, 40 * s, 235, 305, (250, 250, 248), 5)
    return (x, hy)

def sheep(p, x, y, t, s=1.0, expr="happy", arms=None, look=(0, 0), walk=0, bounce=1.0, mouth="smile", kind="ouvrier"):
    return person(p, x, y, t, s, kind, expr, arms, look, walk, bounce, mouth, head_off=100, foot_off=120)

def fox(p, x, y, t, s=1.0, expr="sly", arms=None, look=(1, 0), grin=True, bounce=0.6):
    return person(p, x, y, t, s, "vendeur", expr, arms, look, 0, bounce, "smile", head_off=105, foot_off=150)

# ---------------- décors & accessoires ----------------
def room(p, t, clocks=True):
    p.rect(0, 0, W, 430, G1, None); p.rect(0, 430, W, H, G2, None)
    p.rect(0, 330, W, 430, (188, 186, 180), None); p.line([(0, 330), (W, 330)], INK, 4)
    for k in range(40, W, 170): p.rect(k, 345, k + 130, 418, None, (140, 138, 133), 3)
    for cx in (30, 1050):
        p.rect(cx - 26, 0, cx + 26, 430, (215, 213, 207), INK, 4)
        for k in (-12, 0, 12): p.line([(cx + k, 30), (cx + k, 410)], (160, 158, 153), 2)
        p.rect(cx - 36, 0, cx + 36, 30, (200, 198, 192), INK, 4); p.rect(cx - 36, 410, cx + 36, 432, (200, 198, 192), INK, 4)
    p.line([(0, 430), (W, 430)], INK, 6)
    for k in range(0, W, 90): p.line([(k + 20, 440), (k - 40, H)], (150, 148, 143), 2)
    if clocks:
        for i, cx in enumerate((150, 320, 760, 930)):
            cy = 120 + (i % 2) * 40
            p.ell(cx, cy, 42, 42, PAPER, INK, 5)
            a = t * (40 + i * 25) + i * 70
            p.line([(cx, cy), (cx + math.cos(math.radians(a)) * 30, cy + math.sin(math.radians(a)) * 30)], INK, 3)
            p.line([(cx, cy), (cx + math.cos(math.radians(a / 12 + 200)) * 20, cy + math.sin(math.radians(a / 12 + 200)) * 20)], INK, 4)

def tag(p, x, y, txt, sz=1.0, cross=0.0, new=None, rot=0):
    w, h = 130 * sz, 170 * sz
    p.line([(x, y - h / 2 - 50 * sz), (x, y - h / 2)], INK, 3)
    p.poly([(x - w / 2, y - h / 2 + 20 * sz), (x, y - h / 2 - 8 * sz), (x + w / 2, y - h / 2 + 20 * sz), (x + w / 2, y + h / 2), (x - w / 2, y + h / 2)], PAPER, INK, 5)
    p.ell(x, y - h / 2 + 12 * sz, 7 * sz, 7 * sz, G2, INK, 3)
    p.text(x, y + 10 * sz, txt, 46 * sz)
    if cross > 0:
        x0, y0, x1, y1 = x - w * 0.42, y + 34 * sz, x + w * 0.42, y - 14 * sz
        p.line([(x0, y0), (x0 + (x1 - x0) * cross, y0 + (y1 - y0) * cross)], RED, 9 * sz)
    if new:
        p.text(x, y + h / 2 + 46 * sz, new, 60 * sz, RED, stroke=3)

def watch(p, x, y, r, t, gold=False):
    p.rect(x - r * 0.45, y - r * 1.9, x + r * 0.45, y + r * 1.9, G4, INK, 4, r=8)
    p.ell(x, y, r, r, G1 if gold else PAPER, INK, 6)
    p.ell(x, y, r * 0.8, r * 0.8, PAPER, INK, 2)
    a = t * 300
    p.line([(x, y), (x + math.cos(math.radians(a)) * r * 0.7, y + math.sin(math.radians(a)) * r * 0.7)], RED, 3)
    p.line([(x, y), (x, y - r * 0.5)], INK, 4)

def sparkle(p, x, y, r, t):
    k = 0.6 + 0.4 * abs(math.sin(t * 5 + x))
    r *= k
    p.poly([(x, y - r), (x + r * 0.25, y - r * 0.25), (x + r, y), (x + r * 0.25, y + r * 0.25), (x, y + r), (x - r * 0.25, y + r * 0.25), (x - r, y), (x - r * 0.25, y - r * 0.25)], PAPER, INK, 2)

def sign(p, x, y, txt, w=200, h=100, col=INK, sz=56):
    p.line([(x, y + h / 2), (x, y + h / 2 + 90)], (120, 90, 60), 10)
    p.rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, PAPER, INK, 6, r=6)
    p.text(x, y, txt, sz, col)

def qmark(p, x, y, t, sz=50):
    p.text(x, y + math.sin(t * 6 + x) * 8, "?", sz, INK, stroke=2)

def cloud(p, x, y, rx, ry):
    for a in np.linspace(0, 2 * math.pi, 9)[:-1]:
        p.ell(x + math.cos(a) * rx * 0.8, y + math.sin(a) * ry * 0.7, rx * 0.42, ry * 0.5, INK, None)
    for a in np.linspace(0, 2 * math.pi, 9)[:-1]:
        p.ell(x + math.cos(a) * rx * 0.8, y + math.sin(a) * ry * 0.7, rx * 0.38, ry * 0.45, PAPER, None)
    p.ell(x, y, rx * 0.85, ry * 0.75, PAPER, None)

def ease(x): x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)

# ---------------- scènes ----------------
def s_n01(p, t, T):
    room(p, t)
    sheep(p, 420, 330, t, 1.1, "hearts", arms={1: (95, -40), -1: (-70, 20)}, mouth="smile")
    tag(p, 720, 250, "100 €", 1.2, cross=ease((t - 1.2) / 0.8), new="39 €" if t > 2.4 else None)

def s_n02(p, t, T):
    room(p, t)
    sheep(p, 540, 380, t, 1.0, "happy", look=(0, -1), bounce=0.4)
    k = 1 + 0.06 * math.sin(t * 4)
    cloud(p, 540, 110, 190 * k, 85 * k)
    p.text(540, 110, "100", 92 * k, INK)

def s_n03(p, t, T):
    room(p, t, clocks=False)
    x = 470 + math.sin(t * 3) * 10
    sheep(p, x, 300, t, 1.0, "worried", arms={1: (80, -60), -1: (-80, -60)}, walk=1.0, mouth="wavy")
    sweat(p, x + 60, 170, t)
    ax, ay = 820, 470
    links = bez((x + 30, 420), ((x + ax) / 2, 500), (ax - 40, ay - 60), 10)
    for i, (lx, ly) in enumerate(links): p.ell(lx, ly, 11, 7 if i % 2 else 11, None, INK, 4)
    p.line([(ax, ay - 130), (ax, ay + 40)], INK, 18)
    p.ell(ax, ay - 140, 22, 22, None, INK, 9)
    p.line(bez((ax - 90, ay - 10), (ax, ay + 90), (ax + 90, ay - 10)), INK, 18)
    p.line([(ax - 50, ay - 90), (ax + 50, ay - 90)], INK, 14)
    p.rect(ax - 60, ay - 70, ax + 60, ay - 20, RED, INK, 4, r=6)
    p.text(ax, ay - 45, "100 €", 34, PAPER)

def s_n04(p, t, T):
    room(p, t, clocks=False)
    wx, wy, r = 540, 230, 150
    sp = max(0.0, 1 - t / (T * 0.7))
    a0 = 900 * (t - (t * t) / (2 * T * 0.7)) if t < T * 0.7 else 900 * (T * 0.35)
    for i in range(8):
        a = a0 + i * 45
        p.pie(wx, wy, r, r, a, a + 45, RED if i % 2 else PAPER)
    p.ell(wx, wy, r, r, None, INK, 7)
    for i in range(8):
        a = math.radians(a0 + i * 45 + 22.5)
        p.text(wx + math.cos(a) * r * 0.66, wy + math.sin(a) * r * 0.66, "10" if i % 2 == 0 else "65", 30, INK if i % 2 == 0 else PAPER)
    p.ell(wx, wy, 18, 18, INK, None)
    p.poly([(wx - 16, wy - r - 30), (wx + 16, wy - r - 30), (wx, wy - r + 10)], INK, None)
    p.rect(wx - 12, wy + r - 5, wx + 12, 470, G4, INK, 4)
    scientist(p, 220, 380, t, 0.95, arms={1: (75, -60)})
    scientist(p, 860, 380, t, 0.95, arms={-1: (-70, -40)}, flip=-1)
    if t > T * 0.72:
        p.text(210, 70, "10 … ou 65 ?", 60, RED, stroke=4)

def s_n05(p, t, T):
    room(p, t, clocks=False)
    scientist(p, 260, 370, t, 1.0, arms={1: (110, -70), -1: (-50, 30)})
    gx, gy, r = 420, 210, 80
    p.ell(gx, gy, r, r, PAPER, INK, 6)
    for k in range(3):
        rx = abs(math.cos(t * 1.5 + k * 1.05)) * r
        p.ell(gx, gy, max(rx, 3), r, None, INK, 2)
    p.line([(gx - r, gy), (gx + r, gy)], INK, 2)
    for i, x in enumerate((640, 790, 940)):
        sheep(p, x, 380, t + i * 0.3, 0.75, "happy", look=(-1, -1), arms={1: (40, -95)}, bounce=0.3, mouth="o", kind=("carreaux", "ouvrier")[i % 2])
        qmark(p, x + 10, 120, t + i, 64)

def s_n06(p, t, T):
    room(p, t, clocks=False)
    for i, x in enumerate((140, 330)):
        up = math.sin(t * 6 + i) > 0
        sheep(p, x, 400, t + i * 0.2, 0.68, "happy", arms={1: (55, -100 - (10 if up else 0))}, bounce=0.5, kind=("ouvrier", "carreaux")[i])
    sign(p, 235, 90, "25 %", 230, 100)
    for i, x in enumerate((750, 940)):
        up = math.sin(t * 6 + i) > 0
        sheep(p, x, 400, t + i * 0.2, 0.68, "happy", arms={-1: (-55, -100 - (10 if up else 0))}, bounce=0.5, kind=("carreaux", "ouvrier")[i])
    sign(p, 845, 90, "45 %", 230, 100, RED)
    p.text(235, 26, "ONT VU 10", 30); p.text(845, 26, "ONT VU 65", 30)
    p.line([(540, 40), (540, 560)], INK, 4)

def s_n07(p, t, T):
    p.rect(0, 0, W, H, G1, None)
    sw = math.sin(t * 2.2) * 18
    ox, oy = 540, -40
    ax, ay = ox + math.sin(math.radians(sw)) * 420, oy + math.cos(math.radians(sw)) * 420
    p.text(ax, ay - 60, "65", 260, RED, stroke=6, sc=INK)
    bx, by = ax, ay + 110
    for side in (-1, 1): hose(p, (bx + side * 40, by - 20), (ax + side * 70, ay + 40), side * 20, 9)
    for side in (-1, 1): glove(p, ax + side * 70, ay + 40, 15)
    p.ell(bx, by, 75, 55, (225, 200, 200), INK, 5)
    for k in range(5):
        p.arc(bx - 50 + k * 25, by - 10 + (k % 2) * 15, 18, 14, 180 if k % 2 else 0, 360 if k % 2 else 180, INK, 3)
    p.line([(bx, by - 52), (bx, by + 52)], INK, 3)
    eyes(p, bx, by - 5, "worried", (0, -1), 0.7, t)
    for side in (-1, 1): hose(p, (bx + side * 20, by + 50), (bx + side * 34 + math.sin(t * 9) * 12, by + 130), side * 10, 8)

def s_n08(p, t, T):
    room(p, t)
    k = ease((t - 0.8) / 1.0)
    hx, hy = 60 + 190 * k, 40 - 175 * k
    fox(p, 360, 290, t, 1.05, "sly", arms={1: (hx + 0, hy)})
    mx, my = 360 + hx * 1.05, 290 + hy * 1.05 - 5
    p.line([(mx, my), (mx + 30, my - 50)], RED, 14)
    tag(p, 720, 290, "39 €", 1.2, cross=0)
    if k > 0:
        p.text(720, 105, "100 €", 64, INK, stroke=3)
        p.line([(650, 125), (650 + 140 * k, 125 - 45 * k)], RED, 10)

def s_n09(p, t, T):
    p.rect(0, 0, W, H, G2, None)
    p.rect(60, 40, 1020, 470, G1, INK, 8)
    p.rect(470, 300, 610, 470, G3, INK, 5)
    watch(p, 540, 190, 80, t, gold=True)
    for i in range(6): sparkle(p, 540 + math.cos(i + t) * 140, 190 + math.sin(i * 1.7 + t) * 110, 22, t + i)
    p.rect(470, 300, 610, 340, PAPER, INK, 3); p.text(540, 320, "999 €", 30, RED)
    for i, x in enumerate((170, 300, 780, 910)):
        watch(p, x, 400, 34, t * 0.5 + i)
        p.text(x, 455, "39 €", 26)
    sheep(p, 540, 520, t, 0.55, "hearts", arms={1: (70, -70), -1: (-70, -70)}, bounce=0.3)

def s_n10(p, t, T):
    room(p, t, clocks=False)
    cx, cy, r = 540, 200, 150
    p.ell(cx, cy, r + 14, r + 14, G4, INK, 6); p.ell(cx, cy, r, r, PAPER, INK, 5)
    for i in range(12):
        a = math.radians(i * 30)
        p.line([(cx + math.cos(a) * r * 0.82, cy + math.sin(a) * r * 0.82), (cx + math.cos(a) * r * 0.95, cy + math.sin(a) * r * 0.95)], INK, 5)
    a = math.radians(-90 + int(t * 4) * 18)
    p.line([(cx, cy), (cx + math.cos(a) * r * 0.85, cy + math.sin(a) * r * 0.85)], RED, 6)
    p.line([(cx, cy), (cx + math.cos(a / 6) * r * 0.5, cy + math.sin(a / 6) * r * 0.5)], INK, 8)
    sh = math.sin(t * 40) * 4
    sheep(p, 220 + sh, 330, t, 0.9, "worried", arms={1: (60, -50), -1: (-60, -50)}, mouth="wavy", bounce=0.2)
    sweat(p, 280, 200, t); sweat(p, 165, 210, t + 0.5)
    fox(p, 880, 290, t, 0.95, "sly", look=(-1, 0), arms={-1: (-170, 60)})
    sign(p, 700, 420, "PLUS QUE 2 !", 250, 80, RED, 40)

def s_n11(p, t, T):
    room(p, t, clocks=False)
    mx, my = 600, 120
    p.rect(mx, my, mx + 280, my + 300, G3, INK, 6, r=12)
    p.rect(mx + 30, my + 30, mx + 250, my + 120, PAPER, INK, 5, r=6)
    k = min(1, t / (T * 0.55))
    val = int(39 + (100 - 39) * ease(k)) if t < T * 0.65 else 39
    p.text(mx + 140, my + 75, f"{val} €", 64, RED if t >= T * 0.65 else INK)
    for i in range(3): p.ell(mx + 70 + i * 70, my + 200, 22, 22, PAPER if i != int(t * 3) % 3 else RED, INK, 4)
    a = t * 360 * 1.2
    cx, cy = mx + 280, my + 160
    ex, ey = cx + 60 + math.cos(math.radians(a)) * 50, cy + math.sin(math.radians(a)) * 50
    p.line([(cx, cy), (cx + 60, cy)], INK, 10); p.line([(cx + 60, cy), (ex, ey)], INK, 10)
    fox(p, 380, 290, t, 1.0, "sly", look=(1, 0), arms={1: ((ex - 380), (ey - 290))})
    if t >= T * 0.65: p.text(mx + 140, my + 350, "SOLDES !", 60, RED, stroke=3)

def s_n12(p, t, T):
    room(p, t)
    fox(p, 830, 250, t, 0.9, "sly", look=(-1, 0), arms={-1: (-110, 60)})
    p.rect(560, 330, W, 470, G4, INK, 6); p.line([(560, 350), (W, 350)], (90, 89, 86), 4)
    sheep(p, 300, 330, t, 0.95, "happy", look=(1, 0), arms={1: (110, -20)}, bounce=0.3)
    for i in range(3):
        k = ((t * 0.8 + i / 3) % 1)
        x = 410 + k * 300; y = 300 - math.sin(k * math.pi) * 140
        p.ell(x, y, 18, 18, G1, INK, 4); p.text(x, y, "€", 20)

def s_n13(p, t, T):
    room(p, t)
    fox(p, 320, 290, t, 1.0, "sly", look=(1, 0), arms={1: (190, 30)})
    bx, by = 650, 330
    lid = ease((t - T * 0.55) / 0.6) * 80
    p.rect(bx - 120, by, bx + 120, by + 130, PAPER, INK, 6)
    p.rect(bx - 15, by, bx + 15, by + 130, RED, INK, 3)
    p.rect(bx - 130, by - 40 - lid, bx + 130, by - lid, PAPER, INK, 6)
    p.rect(bx - 15, by - 40 - lid, bx + 15, by - lid, RED, INK, 3)
    heart(p, bx - 25, by - 55 - lid, 16); heart(p, bx + 25, by - 55 - lid, 16)
    p.rect(bx + 135, by + 70, bx + 295, by + 120, PAPER, INK, 3)
    p.line([(bx + 120, by + 95), (bx + 135, by + 95)], INK, 3)
    p.text(bx + 215, by + 95, "SENTIMENT", 28)
    if lid > 40: p.text(bx, by - 140, "… VIDE !", 48, RED, stroke=3)

def s_n14(p, t, T):
    room(p, t)
    sheep(p, 420, 330, t, 1.05, "happy", look=(1, 0.4), arms={1: (90, -10)}, bounce=0.2, mouth="o")
    watch(p, 515, 315, 26, t)
    k = ease(t / 1.2)
    for i, (x, y, r) in enumerate(((560, 160, 12), (610, 120, 20))):
        if k > i * 0.4: p.ell(x, y, r, r, PAPER, INK, 4)
    if k > 0.8:
        cloud(p, 790, 110, 200 * k, 90 * k); p.text(790, 110, "?", 90 * k)

def s_n15(p, t, T):
    p.rect(0, 0, W, H, G1, None)
    k = ease((t - 0.8) / 1.5)
    x, y = 540, 300
    p.line([(x, 40), (x, 110)], INK, 4)
    p.poly([(x - 200, 150), (x, 100), (x + 200, 150), (x + 200, 560), (x - 200, 560)], PAPER, INK, 7)
    c = tuple(int(a + (b - a) * k) for a, b in zip(INK, PAPER))
    r = tuple(int(a + (b - a) * k) for a, b in zip(RED, PAPER))
    p.text(x, 250, "100 €", 110, c)
    p.line([(x - 150, 300), (x + 150, 210)], r, 14)
    p.text(x, 440, "39 €", 150, RED)

SCENES = {k[2:]: v for k, v in globals().items() if k.startswith("s_n")}

# ---------------- effets pellicule ----------------
rng = np.random.default_rng(1930)
GRAIN = [rng.normal(0, 9, (H, W)).astype(np.float32) for _ in range(6)]
yy, xx = np.mgrid[0:H, 0:W]
VIG = (1 - 0.55 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.4).clip(0.35, 1).astype(np.float32)[..., None]

TINT = np.array([-0.07, -0.03, 0.07], dtype=np.float32)

def film(img, i):
    a = np.asarray(img, dtype=np.float32)
    a = a * (0.96 + 0.05 * math.sin(i * 2.3) * random.random()) + GRAIN[i % 6][..., None]
    sat = (a.max(axis=2, keepdims=True) - a.min(axis=2, keepdims=True)) / 255.0
    w = (1 - sat * 4).clip(0, 1)
    a *= 1 + w * TINT
    a *= VIG
    if random.random() < 0.25:
        x = random.randrange(W); a[:, x:x + 2] = a[:, x:x + 2] * 0.5 + 110
    if random.random() < 0.08:
        x, y = random.randrange(W), random.randrange(H); a[y:y + 4, x:x + 4] = 20
    a = np.roll(a, random.choice((-1, 0, 0, 1)), axis=0)
    return a.clip(0, 255).astype(np.uint8)

def duration(sid):
    f = os.path.join(ROOT, "audio", sid + ".mp3")
    if not os.path.exists(f): return 6.0
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                             capture_output=True, text=True).stdout)
    return d + 0.35

def render(sid):
    T = duration(sid); n = int(math.ceil(T * FPS)); random.seed(sid)
    os.makedirs(os.path.join(ROOT, "clips"), exist_ok=True)
    out = os.path.join(ROOT, "clips", sid + ".mp4")
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
                           "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(n):
        t = i / FPS
        im = Image.new("RGB", (W * SS, H * SS), PAPER)
        SCENES[sid](Pen(ImageDraw.Draw(im)), t, T)
        im = im.resize((W, H), Image.BILINEAR)
        ff.stdin.write(film(im, i).tobytes())
    ff.stdin.close(); ff.wait()
    print("ok", sid, f"{T:.1f}s")

if __name__ == "__main__":
    ids = sys.argv[1:] or sorted(SCENES)
    if ids == ["--preview"]:
        os.makedirs(os.path.join(ROOT, "build_tmp"), exist_ok=True)
        for sid in sorted(SCENES):
            T = duration(sid); im = Image.new("RGB", (W * SS, H * SS), PAPER)
            SCENES[sid](Pen(ImageDraw.Draw(im)), T * 0.8, T)
            im.resize((W // 2, H // 2), Image.BILINEAR).save(os.path.join(ROOT, "build_tmp", f"prev_{sid}.png"))
        sys.exit()
    from multiprocessing import Pool
    with Pool(min(4, os.cpu_count() or 1)) as pool: pool.map(render, ids)
