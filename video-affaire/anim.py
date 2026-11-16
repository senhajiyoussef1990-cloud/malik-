#!/usr/bin/env python3
"""Animation « papier découpé » années 30, entièrement en code.

Les personnages et décors sont dessinés une fois par FLUX (assets.py), puis animés ici :
entrées, marche, rebonds, écrasement/étirement, changements de pose, accessoires animés.

Usage : python3 anim.py [n01 ...]        -> clips/<id>.mp4 (1080x608, 12 i/s)
        python3 anim.py --preview        -> build_tmp/aprev_<id>_<plan>.png
"""
import math, os, random, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageOps
import cartoon as C
from cartoon import Pen, ease, tag, heart, sign, cloud, qmark, sparkle, sweat, watch, RED, INK, PAPER, G1, G2, G3, G4

ROOT = os.path.dirname(os.path.abspath(__file__))
W, H, FPS, SS = C.W, C.H, C.FPS, C.SS
FLOOR = 560

# ---------------- éléments graphiques ----------------
_img, _scaled = {}, {}
def asset(name):
    if name not in _img:
        f = os.path.join(ROOT, "assets", name + ".png")
        if os.path.exists(f):
            im = Image.open(f)
        else:   # élément manquant : silhouette provisoire
            im = Image.new("RGBA", (200, 300), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
            d.ellipse([40, 0, 160, 120], fill=(200, 200, 200, 255), outline=(0, 0, 0, 255), width=6)
            d.rounded_rectangle([30, 110, 170, 300], 30, fill=(150, 150, 150, 255), outline=(0, 0, 0, 255), width=6)
            d.text((60, 190), name[:8], fill=(0, 0, 0, 255))
        if name.startswith("decor"):
            im = ImageOps.fit(im.convert("RGB"), (W, H), Image.LANCZOS)
            im = ImageOps.autocontrast(im.convert("L"), cutoff=1).convert("RGB")
        _img[name] = im
    return _img[name]

def sprite(name, h, flip=False):
    k = (name, int(h), flip)
    if k not in _scaled:
        im = asset(name); w = max(1, int(im.width * h / im.height))
        im = im.resize((w, int(h)), Image.LANCZOS)
        _scaled[k] = ImageOps.mirror(im) if flip else im
    return _scaled[k]

class Frame:
    def __init__(self, bg=None, fill=G1):
        self.im = asset(bg).copy() if bg else Image.new("RGB", (W, H), fill)
        self.ov = None
    def actor(self, name, x, h, t, floor=FLOOR, flip=False, bob=1.0, squash=0.0, tilt=0.0, shake=0.0, hop=0.0, speed=1.6):
        """personnage posé au sol (x = centre) avec rebond « rubber hose »"""
        ph = t * speed * 2 * math.pi
        b = abs(math.sin(ph)) * 10 * bob                                     # rebond
        sq = 1 + (0.05 * bob + squash) * math.cos(2 * ph)                    # écrasement / étirement
        sp = sprite(name, h, flip)
        w2, h2 = int(sp.width / math.sqrt(sq)), int(sp.height * sq)
        im = sp.resize((max(1, w2), max(1, h2)), Image.BILINEAR)
        if tilt or shake:
            a = tilt * math.sin(ph) + (random.uniform(-shake, shake) if shake else 0)
            im = im.rotate(a, resample=Image.BICUBIC, expand=True, center=(im.width / 2, im.height))
        y = floor - im.height - b - hop
        self.im.paste(im, (int(x - im.width / 2), int(y)), im)
    def pen(self):
        if self.ov is None:
            self.ov = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0))
        return Pen(ImageDraw.Draw(self.ov))
    def done(self):
        if self.ov is not None:
            ov = self.ov.resize((W, H), Image.LANCZOS)
            self.im.paste(ov, (0, 0), ov)
        return self.im

def slide(t, t0, t1, a, b):
    return a + (b - a) * ease((t - t0) / max(1e-6, t1 - t0))

def pose(t, names, every=0.5):
    return names[int(t / every) % len(names)]

def pop(t, t0, d=0.25):
    """apparition « pop » : 0 -> 1.15 -> 1"""
    k = (t - t0) / d
    if k <= 0: return 0.0
    if k >= 1: return 1.0
    return 1.15 * math.sin(k * math.pi / 2) if k < 0.7 else 1.15 - 0.15 * (k - 0.7) / 0.3

def hearts(p, x, y, t):
    for i in range(3):
        k = (t * 0.7 + i / 3) % 1
        heart(p, x + math.sin(k * 6 + i) * 30 + (i - 1) * 40, y - k * 120, 16 * (1 - k * 0.5))

def coin(p, x, y, r=18):
    p.ell(x, y, r, r, G1, INK, 4); p.text(x, y, "€", r * 1.1)

def wheel(p, wx, wy, r, a0):
    for i in range(8): p.pie(wx, wy, r, r, a0 + i * 45, a0 + i * 45 + 45, RED if i % 2 else PAPER)
    p.ell(wx, wy, r, r, None, INK, 7)
    for i in range(8):
        a = math.radians(a0 + i * 45 + 22.5)
        p.text(wx + math.cos(a) * r * 0.66, wy + math.sin(a) * r * 0.66, "10" if i % 2 == 0 else "65", r * 0.2, INK if i % 2 == 0 else PAPER)
    p.ell(wx, wy, r * 0.12, r * 0.12, INK, None)
    p.poly([(wx - 16, wy - r - 30), (wx + 16, wy - r - 30), (wx, wy - r + 10)], INK, None)

def big_text(p, x, y, txt, sz, t, t0, col=RED):
    k = pop(t, t0)
    if k > 0: p.text(x, y, txt, sz * k, col, stroke=5, sc=PAPER)

# ---------------- plans (2 à 3 par réplique) ----------------
# chaque plan : f(F, t, T) ; t = temps local du plan, T = durée du plan
def n01a(F, t, T):
    F.actor("mouton_montre", 380, 400, t)
    p = F.pen(); tag(p, 760, slide(t, 0, 0.5, -150, 260), "100 €", 1.3)
def n01b(F, t, T):
    F.actor(pose(t, ["mouton_content", "mouton_montre"], 0.6), 380, 400, t, hop=abs(math.sin(t * 6)) * 15)
    p = F.pen(); tag(p, 760, 260, "100 €", 1.3, cross=ease(t / 0.6), new="39 €" if t > 0.8 else None)
    hearts(p, 380, 160, t)
def n02a(F, t, T):
    F.actor("mouton_pointe", 300, 380, t, bob=0.5)
    p = F.pen(); k = pop(t, 0.3); cloud(p, 720, 170, 230 * k + 1, 110 * k + 1)
    if k: p.text(720, 170, "100", 110 * k)
def n02b(F, t, T):
    F.actor("mouton_content", 540, 470, t, floor=700, bob=0.4)
    p = F.pen(); s = 1 + 0.08 * math.sin(t * 5); p.text(540, 90, "100", 120 * s, INK, stroke=5)
def n03a(F, t, T):
    p = F.pen(); y = slide(t, 0, 0.6, -120, 200)
    p.rect(240, y - 70, 840, y + 70, PAPER, INK, 8, r=10); p.text(540, y, "L'ANCRAGE", 96, RED)
    for x in (300, 780): p.line([(x, 0), (x, y - 70)], INK, 4)
def n03b(F, t, T):
    x = 420 + math.sin(t * 3) * 12
    F.actor(pose(t, ["mouton_marche", "mouton_inquiet"], 0.4), x, 380, t, speed=2.5, shake=1.5)
    p = F.pen(); sweat(p, x + 80, 200, t)
    ax, ay = 860, 470
    for i, (lx, ly) in enumerate(C.bez((x + 40, 530), ((x + ax) / 2, 580), (ax - 40, ay + 40), 10)):
        p.ell(lx, ly, 11, 7 if i % 2 else 11, None, INK, 4)
    p.line([(ax, ay - 130), (ax, ay + 40)], INK, 18); p.ell(ax, ay - 140, 22, 22, None, INK, 9)
    p.line(C.bez((ax - 90, ay - 10), (ax, ay + 90), (ax + 90, ay - 10)), INK, 18)
    p.rect(ax - 62, ay - 75, ax + 62, ay - 25, RED, INK, 4, r=6); p.text(ax, ay - 50, "100 €", 34, PAPER)
def n04a(F, t, T):
    F.actor("savant", slide(t, 0, 0.8, -150, 260), 400, t, speed=2)
    F.actor("savant", slide(t, 0, 0.8, 1230, 820), 400, t, flip=True, speed=2)
def n04b(F, t, T):
    F.actor("savant", 180, 380, t, bob=0.3); F.actor("savant", 900, 380, t, flip=True, bob=0.3)
    p = F.pen(); wheel(p, 540, 280, 190, t * 700)
def n04c(F, t, T):
    F.actor("savant", 180, 380, t, bob=0.3); F.actor("savant", 900, 380, t, flip=True, bob=0.3)
    p = F.pen(); a = 700 * (1.0 - math.exp(-t * 2.2)) / 2.2 * 2.2
    wheel(p, 540, 280, 190, 400 + a * 0.6); big_text(p, 540, 560, "10 … ou 65 ?", 70, t, T * 0.55)
def n05a(F, t, T):
    F.actor("savant", 200, 400, t, bob=0.4)
    p = F.pen(); gx, gy, r = 360, 210, 70
    p.ell(gx, gy, r, r, PAPER, INK, 6)
    for k in range(3): p.ell(gx, gy, max(3, abs(math.cos(t * 1.5 + k * 1.05)) * r), r, None, INK, 2)
    p.line([(gx - r, gy), (gx + r, gy)], INK, 2)
    for i, x in enumerate((600, 770, 940)):
        F.actor("mouton_reflechit", x, 300, t + i * 0.3, bob=0.5)
        qmark(p, x, 150, t + i, 70)
def n06a(F, t, T):
    for i, x in enumerate((300, 520)): F.actor("mouton_content", x, 330, t + i * 0.25, hop=abs(math.sin(t * 5 + i)) * 12)
    p = F.pen(); sign(p, 410, slide(t, 0, 0.4, -100, 120), "25 %", 260, 110, INK, 70); p.text(410, 30, "ONT VU 10", 34)
def n06b(F, t, T):
    for i, x in enumerate((560, 780)): F.actor("mouton_pointe", x, 330, t + i * 0.25, flip=True, hop=abs(math.sin(t * 5 + i)) * 12)
    p = F.pen(); sign(p, 670, slide(t, 0, 0.4, -100, 120), "45 %", 260, 110, RED, 70); p.text(670, 30, "ONT VU 65", 34)
def n07a(F, t, T):
    C.s_n07(F.pen(), t, T)
def n08a(F, t, T):
    F.actor("renard_sourire", slide(t, 0, 0.6, -150, 330), 430, t, bob=0.5)
    p = F.pen(); tag(p, 760, 290, "39 €", 1.3)
    k = ease((t - 0.8) / 0.8)
    if k > 0:
        p.text(760, 100, "100 €", 66, INK, stroke=3); p.line([(680, 125), (680 + 160 * k, 125 - 50 * k)], RED, 10)
def n09a(F, t, T):
    F.actor(pose(t, ["renard_presente", "renard_sourire"], 0.9), 320, 430, t, bob=0.6)
    p = F.pen(); tag(p, 780, 280, "39 €", 1.2)
    if t > 0.3:
        p.rect(560, 60, 1000, 150, PAPER, INK, 6, r=8); p.text(780, 105, "PRIX CONSEILLÉ : 199 €", 40, INK)
    if t > 0.9: p.line([(590, 125), (590 + 380 * ease((t - 0.9) / 0.5), 88)], RED, 9)
def n09b(F, t, T):
    p = F.pen()
    p.rect(60, 40, 1020, 520, None, INK, 10); p.rect(470, 330, 610, 520, G3, INK, 5)
    watch(p, 540, 210, 90, t, gold=True)
    for i in range(6): sparkle(p, 540 + math.cos(i + t) * 160, 210 + math.sin(i * 1.7 + t) * 120, 24, t + i)
    p.rect(470, 330, 610, 372, PAPER, INK, 3); p.text(540, 351, "999 €", 32, RED)
    for i, x in enumerate((170, 300, 780, 910)): watch(p, x, 440, 34, t * 0.5 + i); p.text(x, 500, "39 €", 28)
def n09c(F, t, T):
    F.actor("mouton_content", 540, 440, t, hop=abs(math.sin(t * 4)) * 10)
    p = F.pen(); hearts(p, 540, 140, t)
    for i in range(5): sparkle(p, 300 + i * 120, 120 + (i % 2) * 60, 26, t + i)
def n10a(F, t, T):
    p = F.pen(); cx, cy, r = 700, 260, 200
    p.ell(cx, cy, r + 16, r + 16, G4, INK, 6); p.ell(cx, cy, r, r, PAPER, INK, 5)
    for i in range(12):
        a = math.radians(i * 30)
        p.line([(cx + math.cos(a) * r * .82, cy + math.sin(a) * r * .82), (cx + math.cos(a) * r * .95, cy + math.sin(a) * r * .95)], INK, 5)
    a = math.radians(-90 + int(t * 4) * 18)
    p.line([(cx, cy), (cx + math.cos(a) * r * .85, cy + math.sin(a) * r * .85)], RED, 7)
    F.actor("mouton_inquiet", 250, 400, t, shake=3, bob=0.3)
    sweat(p, 330, 200, t); sweat(p, 180, 220, t + 0.5)
def n10b(F, t, T):
    F.actor(pose(t, ["renard_clin", "renard_sourire"], 0.7), 330, 430, t)
    p = F.pen(); on = int(t * 3) % 2 == 0
    sign(p, 760, 240, "PLUS QUE 2 !", 380, 120, RED if on else INK, 62)
def machine(p, t, val, col=INK):
    mx, my = 560, 120
    p.rect(mx, my, mx + 320, my + 330, G3, INK, 6, r=12)
    p.rect(mx + 30, my + 30, mx + 290, my + 130, PAPER, INK, 5, r=6); p.text(mx + 160, my + 80, f"{val} €", 72, col)
    for i in range(3): p.ell(mx + 80 + i * 80, my + 220, 24, 24, RED if i == int(t * 3) % 3 else PAPER, INK, 4)
def n11a(F, t, T):
    F.actor(pose(t, ["renard_presente", "renard_sourire"], 0.5), 300, 430, t, speed=2.2)
    p = F.pen(); machine(p, t, int(39 + 61 * ease(t / (T * 0.8))))
    big_text(p, 720, 520, "30 jours avant…", 46, t, 0.2, INK)
def n11b(F, t, T):
    F.actor("renard_rit", 300, 430, t, speed=2.5, squash=0.04)
    p = F.pen(); machine(p, t, 39, RED); big_text(p, 720, 520, "SOLDES !", 80, t, 0.2)
def n12a(F, t, T):
    F.actor("renard_sourire", 820, 420, t, bob=0.4, flip=True)
    F.actor("mouton_montre", 290, 420, t, bob=0.5)
    p = F.pen()
    for i in range(4):
        k = ((t * 0.9 + i / 4) % 1)
        coin(p, 420 + k * 330, 300 - math.sin(k * math.pi) * 170)
def n13a(F, t, T):
    F.actor("renard_clin", 290, 430, t)
    p = F.pen(); bx, by = 720, 410; lid = ease((t - T * 0.5) / 0.5) * 90
    p.rect(bx - 130, by, bx + 130, by + 140, PAPER, INK, 6); p.rect(bx - 16, by, bx + 16, by + 140, RED, INK, 3)
    p.rect(bx - 140, by - 42 - lid, bx + 140, by - lid, PAPER, INK, 6); p.rect(bx - 16, by - 42 - lid, bx + 16, by - lid, RED, INK, 3)
    heart(p, bx - 26, by - 58 - lid, 17); heart(p, bx + 26, by - 58 - lid, 17)
    if lid > 50: big_text(p, bx, by - 180, "VIDE !", 70, t, T * 0.75)
def n13b(F, t, T):
    F.actor("mouton_content", 540, 440, t, hop=abs(math.sin(t * 5)) * 18, speed=2)
    p = F.pen(); hearts(p, 540, 130, t); big_text(p, 540, 560, "le sentiment… offert", 52, t, 0.3, INK)
def n14a(F, t, T):
    F.actor("mouton_reflechit", 360, 430, t, bob=0.3)
    p = F.pen(); k = ease(t / 1.0)
    for i, (x, y, r) in enumerate(((480, 190, 12), (540, 150, 20))):
        if k > i * 0.4: p.ell(x, y, r, r, PAPER, INK, 4)
    if k > 0.8: cloud(p, 760, 140, 220 * k, 100 * k); p.text(760, 140, "?", 100 * k)
def n15a(F, t, T):
    p = F.pen(); k = ease((t - 0.8) / 1.5); x = 620
    p.line([(x, 30), (x, 100)], INK, 4)
    p.poly([(x - 200, 140), (x, 90), (x + 200, 140), (x + 200, 560), (x - 200, 560)], PAPER, INK, 7)
    c = tuple(int(a + (b - a) * k) for a, b in zip(INK, PAPER)); r = tuple(int(a + (b - a) * k) for a, b in zip(RED, PAPER))
    p.text(x, 240, "100 €", 110, c); p.line([(x - 150, 290), (x + 150, 200)], r, 14); p.text(x, 430, "39 €", 150, RED)
    F.done(); F.ov = None
    F.actor("mouton_reflechit", 200, 330, t, bob=0.3)

SHOTS = {
    "n01": [("decor_boutique", n01a), ("decor_boutique", n01b)],
    "n02": [("decor_boutique", n02a), (None, n02b)],
    "n03": [("decor_scene", n03a), ("decor_scene", n03b)],
    "n04": [("decor_labo", n04a), ("decor_labo", n04b), ("decor_labo", n04c)],
    "n05": [("decor_labo", n05a)],
    "n06": [("decor_scene", n06a), ("decor_scene", n06b)],
    "n07": [(None, n07a)],
    "n08": [("decor_boutique", n08a)],
    "n09": [("decor_boutique", n09a), (None, n09b), ("decor_boutique", n09c)],
    "n10": [("decor_boutique", n10a), ("decor_boutique", n10b)],
    "n11": [("decor_labo", n11a), ("decor_labo", n11b)],
    "n12": [("decor_boutique", n12a)],
    "n13": [("decor_boutique", n13a), ("decor_scene", n13b)],
    "n14": [("decor_boutique", n14a)],
    "n15": [(None, n15a)],
}

def frame(sid, t, T):
    shots = SHOTS[sid]; d = T / len(shots); k = min(int(t / d), len(shots) - 1)
    bg, f = shots[k]
    F = Frame(bg); f(F, t - k * d, d)
    return F.done()

def render(sid):
    T = C.duration(sid); n = int(math.ceil(T * FPS)); random.seed(sid)
    out = os.path.join(ROOT, "clips", sid + ".mp4")
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
                           "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(n):
        ff.stdin.write(C.film(frame(sid, i / FPS, T), i).tobytes())
    ff.stdin.close(); ff.wait()
    print("ok", sid, f"{T:.1f}s, {len(SHOTS[sid])} plan(s)", flush=True)

if __name__ == "__main__":
    os.makedirs(os.path.join(ROOT, "clips"), exist_ok=True)
    args = sys.argv[1:]
    if args[:1] == ["--preview"]:
        ids = args[1:] or sorted(SHOTS)
        for sid in ids:
            T = C.duration(sid); d = T / len(SHOTS[sid])
            for k in range(len(SHOTS[sid])):
                im = frame(sid, k * d + d * 0.7, T)
                im.resize((W // 2, H // 2)).save(os.path.join(ROOT, "build_tmp", f"aprev_{sid}_{k}.png"))
        sys.exit()
    from multiprocessing import Pool
    with Pool(min(3, os.cpu_count() or 1)) as pool: pool.map(render, args or sorted(SHOTS))
