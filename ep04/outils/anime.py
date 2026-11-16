#!/usr/bin/env python3
"""EP04 — animation en code des 15 scènes (papier découpé + caméra + effets années 30).

Entrées : images/Scene_XX.jpg, travail/masques/*.png (SAM), travail/minutage.json
Sortie  : travail/bande.mp4 (1080x810, 30 i/s, sans son) + travail/plans.json (minutage des plans)
Usage   : python3 outils/anime.py [--apercu] [--de S --a S]
Principes repris du style « rubber hose 1930 » (huashu-art-motion, MIT) : rebond sur le tempo (128 BPM),
écrasement à l'atterrissage, mouvement « sur 2 » (12 i/s), couche pellicule (tremblement, scintillement,
rayures, poussières, grain, vignettage).
"""
import json, math, os, random, subprocess, sys
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SC = json.load(open(f"{R}/scenes.json"))
IW, IH = 1448, 1086
BW, BH = 1080, 810                 # bande vidéo (4:3)
FPS = 30
BPM = 128; BEAT = 60 / BPM
FONT = f"{R}/fonts/oswald-latin-700-normal.ttf"
rnd = random.Random(1930)

def ease(x): x = max(0.0, min(1.0, x)); return x * x * (3 - 2 * x)

# ---------------------------------------------------------------- préparation des scènes
class Acteur:
    def __init__(self, name, img, mask):
        ys, xs = np.nonzero(mask > 127)
        self.name = name
        if len(xs) == 0:
            self.ok = False; return
        self.ok = True
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        rgba = np.dstack([img, cv2.GaussianBlur(mask, (3, 3), 0)])[y0:y1, x0:x1]
        self.im = Image.fromarray(rgba, "RGBA")
        self.x0, self.y0, self.w, self.h = int(x0), int(y0), int(x1 - x0), int(y1 - y0)
        self.cx, self.by = self.x0 + self.w / 2, self.y0 + self.h     # pivot : bas, au centre

class Scene:
    def __init__(self, n):
        self.n = n; cfg = SC[str(n)]
        img = np.asarray(Image.open(f"{R}/images/Scene_{n:02d}.jpg").convert("RGB").resize((IW, IH)))
        self.acteurs = {}; hole = np.zeros((IH, IW), np.uint8)
        for name in cfg["acteurs"]:
            f = f"{R}/travail/masques/S{n:02d}_{name}.png"
            if not os.path.exists(f): continue
            m = np.asarray(Image.open(f).convert("L").resize((IW, IH)))
            a = Acteur(name, img, m)
            if a.ok:
                self.acteurs[name] = a
                hole = np.maximum(hole, cv2.dilate(m, np.ones((9, 9), np.uint8)))
        cache = f"{R}/travail/fond_S{n:02d}.png"
        if os.path.exists(cache):
            self.fond = Image.open(cache).convert("RGB")
        else:   # reconstitue le décor derrière les acteurs
            bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            small = cv2.resize(bgr, (IW // 2, IH // 2)); hs = cv2.resize(hole, (IW // 2, IH // 2))
            inp = cv2.inpaint(small, hs, 9, cv2.INPAINT_TELEA)
            inp = cv2.resize(inp, (IW, IH)); full = bgr.copy(); full[hole > 0] = inp[hole > 0]
            self.fond = Image.fromarray(cv2.cvtColor(full, cv2.COLOR_BGR2RGB)); self.fond.save(cache)
        self.couleur = cfg["couleur"]; self.tele = cfg.get("tele")

_scenes = {}
def scene(n):
    if n not in _scenes: _scenes[n] = Scene(n)
    return _scenes[n]

# ---------------------------------------------------------------- mouvements
def bnc(tq, ph):                       # rebond sur le tempo : 0 = au sol
    return abs(math.sin(math.pi * (tq / BEAT + ph)))

def pose_acteur(a, t, mode, ph=0.0, parle=False):
    """renvoie (dx, dy, sx, sy, angle, pivot) pour l'acteur au temps t"""
    tq = math.floor(t * 12) / 12          # « sur 2 »
    b = bnc(tq, ph); land = (1 - b) ** 6
    amp = 7 if not parle else 12
    dx, dy, sx, sy, ang, piv = 0.0, -amp * b, 1 + 0.05 * land, 1 - 0.05 * land, 0.0, "bas"
    if parle: ang = 2.2 * math.sin(math.pi * 2 * tq / BEAT + ph)
    if mode == "rire":
        dy += -abs(math.sin(tq * 18)) * 10; sx, sy = 1 + 0.04 * math.sin(tq * 36), 1 - 0.04 * math.sin(tq * 36)
    elif mode == "tremble":
        dx += rnd.uniform(-3, 3); dy += rnd.uniform(-2, 2)
    elif mode == "marche":
        dy = -16 * bnc(tq, ph * 2) ; ang = 4 * math.sin(math.pi * tq / BEAT); dx = 4 * math.sin(math.pi * tq / BEAT)
    elif mode == "court":
        dy = -26 * abs(math.sin(tq * 14)); ang = -6 + 3 * math.sin(tq * 14); dx = 25 * min(1, t / 3)
    elif mode == "balance":
        dx, dy, sx, sy = 0, 0, 1, 1; ang = 5 * math.sin(t * 3.2); piv = "haut"
    elif mode == "flotte":
        dy = 10 * math.sin(t * 2.4); ang = 3 * math.sin(t * 1.7); sx, sy = 1, 1
    elif mode == "fige":
        dx, dy, sx, sy, ang = 0, 0, 1, 1, 0
    elif mode == "secoue":
        k = (t % 1.2) < 0.35
        dx, dy = (rnd.uniform(-5, 5), rnd.uniform(-4, 1)) if k else (0, 0); sx = sy = 1; ang = 0
    elif mode == "hop":
        dy = -30 * bnc(tq, ph) ; sx, sy = 1 + 0.08 * land, 1 - 0.08 * land
    return dx, dy, sx, sy, ang, piv

def colle(canvas, a, pose, alpha=1.0):
    dx, dy, sx, sy, ang, piv = pose
    im = a.im
    if abs(sx - 1) > 1e-3 or abs(sy - 1) > 1e-3:
        im = im.resize((max(1, int(a.w * sx)), max(1, int(a.h * sy))), Image.BILINEAR)
    w, h = im.size
    if piv == "haut": ox, oy = a.cx - w / 2, a.y0
    else: ox, oy = a.cx - w / 2, a.by - h
    if abs(ang) > 0.05:
        c = (w / 2, 0) if piv == "haut" else (w / 2, h)
        big = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0)); big.paste(im, (w // 2, h // 2))
        big = big.rotate(ang, resample=Image.BICUBIC, center=(w // 2 + c[0], h // 2 + c[1]))
        ox -= w // 2; oy -= h // 2; im = big
    if alpha < 1:
        al = im.getchannel("A").point(lambda v: int(v * alpha)); im = im.copy(); im.putalpha(al)
    canvas.paste(im, (int(ox + dx), int(oy + dy)), im)

# ---------------------------------------------------------------- petits effets dessinés
def font(sz): return ImageFont.truetype(FONT, int(sz))
def etoile(d, x, y, r, col=(255, 255, 255)):
    pts = []
    for k in range(10):
        rr = r if k % 2 == 0 else r * 0.38; a = math.pi / 5 * k - math.pi / 2
        pts.append((x + rr * math.cos(a), y + rr * math.sin(a)))
    d.polygon(pts, fill=col, outline=(20, 20, 20))
def marque(d, x, y, txt, sz, t, t0, col=(255, 255, 255)):
    k = (t - t0) / 0.25
    if k <= 0: return
    s = max(6, sz * (1.25 if k < 0.6 else 1.0) * min(1, k * 2))
    y2 = y + math.sin(t * 7 + x) * 5
    d.text((x, y2), txt, font=font(s), fill=col, anchor="mm", stroke_width=max(2, int(s / 14)), stroke_fill=(15, 15, 15))
def traits(d, x, y, t, n=3, long=40, ang0=-60):
    for i in range(n):
        a = math.radians(ang0 + i * 30); k = 0.6 + 0.4 * abs(math.sin(t * 9 + i))
        x1, y1 = x + math.cos(a) * 20, y + math.sin(a) * 20
        d.line([(x1, y1), (x1 + math.cos(a) * long * k, y1 + math.sin(a) * long * k)], fill=(15, 15, 15), width=6)
def goutte(d, x, y, t):
    k = (t * 1.6) % 1
    d.ellipse([x - 9, y + k * 50 - 13, x + 9, y + k * 50 + 13], fill=(225, 235, 245), outline=(20, 20, 20), width=3)
def billet(d, x, y, a, s=1.0):
    w, h = 70 * s, 34 * s; c, sn = math.cos(a), math.sin(a)
    pts = [(x + c * px - sn * py, y + sn * px + c * py) for px, py in ((-w/2, -h/2), (w/2, -h/2), (w/2, h/2), (-w/2, h/2))]
    d.polygon(pts, fill=(222, 222, 210), outline=(30, 30, 30)); d.ellipse([x - 8 * s, y - 8 * s, x + 8 * s, y + 8 * s], outline=(30, 30, 30), width=2)
def rayons(d, x, y, t, r=110):
    for i in range(12):
        a = math.radians(i * 30 + t * 40); k = 0.7 + 0.3 * math.sin(t * 12 + i)
        d.line([(x + math.cos(a) * r * .45, y + math.sin(a) * r * .45), (x + math.cos(a) * r * k, y + math.sin(a) * r * k)], fill=(255, 250, 220), width=7)
def poussiere(d, x, y, t, ph=0):
    k = ((t * 1.5 + ph) % 1)
    for i in range(3):
        r = 12 + k * 26 - i * 4
        if r > 0: d.ellipse([x - i * 22 - r - k * 30, y - r - i * 6, x - i * 22 + r - k * 30, y + r - i * 6], fill=(245, 245, 245), outline=(25, 25, 25), width=3)

# ---------------------------------------------------------------- direction artistique, scène par scène
# acteurs : nom -> (mode, phase, parleur associé) ; caméra : cadrages sur le parleur ; effets : fonction
QUI = {"renard": "renard", "mouton": "mouton", "vendeur": "vendeur", "client": "client"}
DIRECTION = {
 1:  {"modes": {"renard": ("idle", .5), "mouton": ("marche", .25), "chapeau": ("idle", .0)}, "parleurs": {"mouton": "mouton"}},
 2:  {"modes": {"renard": ("idle", .5), "mouton": ("rire", .25), "chapeau": ("chute", 0)}, "parleurs": {"renard": "renard", "mouton": "mouton"}},
 3:  {"modes": {"vendeur": ("tremble", .3)}, "parleurs": {}},
 4:  {"modes": {"client": ("hop", .25), "vendeur": ("idle", .5), "ampoule": ("flotte", 0), "pancarte": ("balance", 0)}, "parleurs": {"vendeur": "vendeur"}},
 5:  {"modes": {"marcheur": ("marche", .25)}, "parleurs": {}},
 6:  {"modes": {"m1": ("marche", 0), "m2": ("marche", .25), "m3": ("marche", .5), "m4": ("marche", .75), "passante": ("idle", .3)}, "parleurs": {"passante": "passante"}},
 7:  {"modes": {"client": ("hop", .25), "vendeur": ("idle", .5), "caisse": ("secoue", 0)}, "parleurs": {"client": "client"}},
 8:  {"modes": {"client": ("idle", .25)}, "parleurs": {}},
 9:  {"modes": {"foule": ("rire", 0), "client": ("court", .25)}, "parleurs": {"foule": "foule"}},
 10: {"modes": {"vendeur": ("flotte", 0)}, "parleurs": {"vendeur": "vendeur"}},
 11: {"modes": {"client": ("idle", .25)}, "parleurs": {"client": "client"}},
 12: {"modes": {"client": ("idle", .25)}, "parleurs": {"client": "client"}},
 13: {"modes": {"renard": ("idle", .5), "mouton": ("idle", .25)}, "parleurs": {"mouton": "mouton", "renard": "renard"}},
 14: {"modes": {"renard": ("idle", .5), "chapeau": ("balance", 0), "mouton": ("hop", .25)}, "parleurs": {"renard": "renard", "mouton": "mouton"}},
 15: {"modes": {"renard": ("idle", .5), "mouton": ("tremble", .25)}, "parleurs": {}},
}

def effets(n, d, t, T, lignes):
    """effets dessinés par-dessus (coordonnées de l'image)"""
    if n == 1:
        for i, (x, y) in enumerate(((470, 200), (980, 230), (720, 90), (560, 420))):
            if math.sin(t * 5 + i * 2) > 0.2: etoile(d, x, y, 18 + 6 * math.sin(t * 9 + i))
    if n == 2:
        traits(d, 1290, 380, t, ang0=-70); traits(d, 1010, 420, t, ang0=-150)
    if n == 3:
        goutte(d, 330, 330, t); goutte(d, 160, 360, t + .5)
    if n == 4:
        rayons(d, 615, 85, t)
    if n == 5:
        for i, (x, y) in enumerate(((120, 230), (270, 240), (1080, 250), (1290, 260))): marque(d, x, y, "?!" if i % 2 else "?", 60, t, 0.6 + i * 0.35)
        traits(d, 400, 520, t, ang0=150, long=50)
    if n == 6:
        marque(d, 1230, 200, "!", 80, t, max(0.5, lignes.get("s06b", (99,))[0])); [poussiere(d, x, 930, t, i * .3) for i, x in enumerate((230, 420, 650, 900))]
    if n == 7:
        k = (t % 1.2)
        if k < 0.5:
            for i in range(5): etoile(d, 980 + math.cos(i * 1.3) * 160 * (0.5 + k), 560 + math.sin(i * 1.3) * 90 * (0.5 + k) - 60, 16)
        marque(d, 600, 420, "!", 70, t, 0.4)
    if n == 8:
        for i, (x, y) in enumerate(((690, 540), (800, 520))): marque(d, x, y, "?", 64, t, 0.4 + i * .5)
    if n == 9:
        poussiere(d, 640, 930, t); goutte(d, 980, 470, t); [traits(d, x, y, t, ang0=-100) for x, y in ((160, 260), (360, 210), (560, 230))]
    if n == 10:
        for i in range(26):
            r = random.Random(i); x = r.uniform(150, 1300); sp = r.uniform(90, 170)
            y = (r.uniform(-300, 1086) + t * sp) % 1200 - 100
            billet(d, x + 30 * math.sin(t * 2 + i), y, math.sin(t * 2.5 + i) * 0.9, r.uniform(.7, 1.1))
    if n == 11:
        marque(d, 600, 190, "?", 90, t, 0.3)
    if n == 13:
        marque(d, 1290, 330, "?", 70, t, max(0.3, lignes.get("s13a", (0,))[0]))
    if n == 14:
        st = lignes.get("s14b", (99,))[0]
        if t > st: traits(d, 1150, 420, t, ang0=-120, long=55); traits(d, 1390, 430, t, ang0=-60, long=55)

# ---------------------------------------------------------------- caméra
def cadre_acteur(sc, name, z=1.45):
    a = sc.acteurs.get(name)
    if not a: return (IW / 2, IH / 2, 1.0)
    return (a.cx, a.y0 + a.h * 0.42, z)

def cadrages(n, sc, lignes_scene):
    """liste de (t_debut, cible, transition) ; cible = (cx, cy, zoom)"""
    out = [(0.0, (IW / 2, IH / 2, 1.0), "coupe")]
    parl = DIRECTION[n]["parleurs"]; k = 0
    for lid, (st, du, who) in lignes_scene.items():
        acteur = next((a for a, w in parl.items() if w == who), None)
        if acteur and acteur in sc.acteurs:
            cible = cadre_acteur(sc, acteur, 1.38 if k % 2 == 0 else 1.6)
        else:
            cible = (IW / 2 + (60 if k % 2 else -60), IH / 2, 1.08 + 0.06 * (k % 2))
        out.append((st, cible, "coupe" if k % 2 else "glisse")); k += 1
    return out

def camera(cads, t):
    cur = cads[0][1]
    for i, (st, cible, tr) in enumerate(cads):
        if t < st: break
        if tr == "coupe": cur = cible
        else:
            k = ease((t - st) / 0.6); prev = cur
            cur = tuple(p + (c - p) * k for p, c in zip(prev, cible))
    cx, cy, z = cur
    z = max(1.0, z * (1 + 0.015 * math.sin(t * 0.8)))         # respiration de caméra
    w, h = IW / z, IH / z
    cx = min(max(cx, w / 2), IW - w / 2); cy = min(max(cy, h / 2), IH - h / 2)
    return (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)

# ---------------------------------------------------------------- pellicule
_rng = np.random.default_rng(1930)
GRAIN = [_rng.normal(0, 9, (BH, BW)).astype(np.float32) for _ in range(6)]
_yy, _xx = np.mgrid[0:BH, 0:BW]
VIG = (1 - 0.42 * (((_xx - BW / 2) / (BW / 2)) ** 2 + ((_yy - BH / 2) / (BH / 2)) ** 2) ** 1.6).clip(.4, 1).astype(np.float32)[..., None]
def pellicule(im, t, couleur):
    a = np.asarray(im, dtype=np.float32)
    fi = int(t * 24)
    r = random.Random(fi)
    a = a * (1 - r.uniform(0, 0.05)) + r.uniform(0, 14)
    a += GRAIN[fi % 6][..., None] * (0.7 if couleur else 1.0)
    if not couleur:
        g = a.mean(axis=2, keepdims=True); a = g * np.array([0.95, 0.97, 1.03], np.float32) + 4
    else:
        a = a * np.array([1.03, 1.0, 0.93], np.float32)
    rs = random.Random(int(t * 6))
    for _ in range(3 if not couleur else 1):
        x = rs.randrange(BW); a[:, x:x + 2] = a[:, x:x + 2] * 0.6 + 90
    for _ in range(10):
        x, y = r.randrange(BW), r.randrange(BH); a[y:y + 3, x:x + 3] = 25
    a *= VIG
    a = np.roll(a, (r.choice((-1, 0, 0, 1)), r.choice((-1, 0, 1))), axis=(0, 1))
    return a.clip(0, 255).astype(np.uint8)

# ---------------------------------------------------------------- composition d'une image
def compose(n, t, T, lignes_scene, cads, fige_apres=None):
    sc = scene(n); canvas = sc.fond.copy()
    tt = min(t, fige_apres) if fige_apres is not None else t
    parle_now = {who for lid, (st, du, who) in lignes_scene.items() if st <= t < st + du}
    for name, a in sc.acteurs.items():
        mode, ph = DIRECTION[n]["modes"].get(name, ("idle", 0))
        parle = DIRECTION[n]["parleurs"].get(name) in parle_now
        if fige_apres is not None and t >= fige_apres: mode = "fige"
        if mode == "chute":
            k = min(1, tt / 0.5); dy = -(1 - k) ** 2 * 500; land = max(0, 1 - abs(tt - 0.5) / 0.18)
            pose = (0, dy, 1 + 0.12 * land, 1 - 0.12 * land, 0, "bas")
        else:
            pose = pose_acteur(a, tt, mode, ph, parle)
        colle(canvas, a, pose)
    d = ImageDraw.Draw(canvas)
    if fige_apres is None or t < fige_apres:
        effets(n, d, t, T, {k: v for k, v in lignes_scene.items()})
    box = camera(cads, t)
    return canvas.resize((BW, BH), Image.BILINEAR, box=box)

def dans_tele(fond_n, inner_frame, t_rel, dur, entre=True):
    """zoom dans (ou depuis) l'écran du téléviseur de la scène 13"""
    sc = scene(13); x0, y0, x1, y1 = sc.tele
    k = ease(t_rel / dur); k = k if entre else 1 - k
    canvas = sc.fond.copy()
    for name, a in sc.acteurs.items(): colle(canvas, a, pose_acteur(a, t_rel, "idle", 0.3))
    sx0, sy0, sx1, sy1 = x0 + 14, y0 + 12, x1 - 50, y1 - 22             # écran (sans le cadre en bois)
    scr = inner_frame.resize((int(sx1 - sx0), int(sy1 - sy0))).convert("L").convert("RGB")
    canvas.paste(scr, (int(sx0), int(sy0)))
    cx, cy = (sx0 + sx1) / 2, (sy0 + sy1) / 2
    zf = IW / (sx1 - sx0)
    z = 1 + (zf - 1) * k
    w, h = IW / z, IH / z
    lx = (1 - k) * IW / 2 + k * cx; ly = (1 - k) * IH / 2 + k * cy
    lx = min(max(lx, w / 2), IW - w / 2); ly = min(max(ly, h / 2), IH - h / 2)
    return canvas.resize((BW, BH), Image.BILINEAR, box=(lx - w / 2, ly - h / 2, lx + w / 2, ly + h / 2)), (k > 0.85)

# ---------------------------------------------------------------- minutage global
LEAD, TELE_IN, TELE_OUT = 0.45, 1.6, 1.6
def plan():
    mn = json.load(open(f"{R}/travail/minutage.json"))
    lignes = json.load(open(f"{R}/lignes.json"))
    scenes, t = [], 0.0
    for n in range(1, 16):
        L = [l for l in lignes if l["scene"] == n]
        start = t; local = LEAD + (TELE_IN if n == 3 else 0) + (TELE_OUT if n == 13 else 0)
        ls = {}
        for l in L:
            du = mn[l["id"]]["dur"]; ls[l["id"]] = (local, du, l["who"]); local += du + l["pause"]
        dur = max(local + 0.2, 6.0)
        scenes.append({"n": n, "t0": start, "dur": dur, "lignes": ls}); t += dur
    return scenes

def rendu(apercu=False, de=1, a=15):
    sc_list = plan()
    json.dump(sc_list, open(f"{R}/travail/plans.json", "w"), indent=1)
    total = sum(s["dur"] for s in sc_list)
    print(f"durée totale : {total:.1f} s", flush=True)
    for s in sc_list:
        n = s["n"]
        if not (de <= n <= a): continue
        ff = None
        if not apercu:
            ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{BW}x{BH}",
                                   "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
                                   "-pix_fmt", "yuv420p", f"{R}/travail/bande_S{n:02d}.mp4"], stdin=subprocess.PIPE)
        sc = scene(n); T = s["dur"]
        cads = cadrages(n, sc, s["lignes"])
        fige = None
        if n == 15: fige = s["lignes"]["s15b"][0] - 0.3          # arrêt sur image avant la dernière question
        nf = int(round(T * FPS))
        frames = [nf * 0.35] if apercu else range(nf)
        for i in frames:
            t = i / FPS
            if n == 3 and t < TELE_IN:                           # le renard allume la télé, on plonge dedans
                inner = compose(3, 0.0, T, s["lignes"], [(0, (IW / 2, IH / 2, 1.0), "coupe")])
                im, _ = dans_tele(13, inner, t, TELE_IN, entre=True)
                couleur = True
            elif n == 13 and t < TELE_OUT:                       # on ressort de la télé
                inner = compose(12, 99.0, 99, {}, [(0, (IW / 2, IH / 2, 1.0), "coupe")])
                im, _ = dans_tele(13, inner, t, TELE_OUT, entre=False)
                couleur = True
            else:
                im = compose(n, t, T, s["lignes"], cads, fige)
                couleur = sc.couleur
            if n == 15 and fige is not None and t > fige:        # iris qui se ferme sur le renard
                k = ease((t - fige - 0.4) / 1.4)
                if k > 0:
                    m = Image.new("L", (BW, BH), 0); r = int((1 - k) * 900 + 60)
                    a_ = scene(15).acteurs.get("renard"); cx, cy = (300, 260) if not a_ else ((a_.cx) * BW / IW, (a_.y0 + 80) * BH / IH)
                    ImageDraw.Draw(m).ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
                    black = Image.new("RGB", (BW, BH), (8, 8, 8)); im = Image.composite(im, black, m)
            frame = pellicule(im, s["t0"] + t, couleur)
            if apercu:
                Image.fromarray(frame).resize((540, 405)).save(f"{R}/travail/apercu_S{n:02d}.jpg"); continue
            ff.stdin.write(frame.tobytes())
        if ff: ff.stdin.close(); ff.wait()
        print(f"  S{n:02d}  {T:5.1f}s", flush=True)

def tout():
    """rend les 15 scènes en parallèle puis les assemble dans travail/bande.mp4"""
    from multiprocessing import Pool
    rendu(True, 99, 0)                                   # écrit plans.json + fonds
    for n in range(1, 16): scene(n)
    ordre = sorted(range(1, 16), key=lambda n: -[s["dur"] for s in plan()][n - 1])
    with Pool(4) as p: p.starmap(rendu, [(False, n, n) for n in ordre])
    with open(f"{R}/travail/bandes.txt", "w") as f:
        f.writelines(f"file '{R}/travail/bande_S{n:02d}.mp4'\n" for n in range(1, 16))
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", f"{R}/travail/bandes.txt",
                    "-c", "copy", f"{R}/travail/bande.mp4"], check=True)

if __name__ == "__main__":
    args = sys.argv[1:]
    de = int(args[args.index("--de") + 1]) if "--de" in args else 1
    a = int(args[args.index("--a") + 1]) if "--a" in args else 15
    if "--tout" in args: tout()
    else: rendu("--apercu" in args, de, a)
