#!/usr/bin/env python3
"""Marionnettes articulées découpées dans les images d'origine (tous les détails sont conservés).

Chaque personnage est découpé en pièces (tête, mâchoire, bras…) définies par un polygone et un pivot.
Les pièces pivotent et se courbent (« rubber hose ») ; la mâchoire suit l'enveloppe de la voix.
Usage : python3 outils/pantin.py 2 3      -> travail/bande_S02.mp4, travail/bande_S03.mp4
"""
import json, math, os, sys
import numpy as np, cv2
from PIL import Image
import anime as A

R = A.R; M = 140
BOUCHE = json.load(open(f"{R}/code/bouche.json"))
sin = lambda f, t, ph=0.0: math.sin(2 * math.pi * f * t + ph)

# ---------------------------------------------------------------- découpe (coordonnées de l'image 1448x1086)
# couche : nom, polygone (None = tout), pivot, parent, dessous ('vide' | 'peint' | 'creux'), garde (rayon conservé sous la pièce)
RIGS = {
 (2, "renard"): [
   dict(nom="tete", poly=[(180,150),(335,150),(350,250),(425,305),(430,340),(350,368),(325,385),(300,410),(255,400),(215,385),(185,335)], pivot=(262,400), garde=70),
   dict(nom="machoire", parent="tete", poly=[(300,347),(350,350),(402,337),(420,343),(350,366),(320,380),(300,375)], pivot=(300,350), dessous="creux", couleur=(70,22,16), garde=22),
   dict(nom="bras", poly=[(395,395),(480,400),(555,385),(590,335),(650,340),(650,415),(600,440),(560,465),(470,470),(400,480)], pivot=(405,440), garde=45),
 ],
 (2, "mouton"): [
   dict(nom="tete", poly=[(1115,340),(1200,318),(1300,325),(1352,370),(1356,440),(1345,512),(1300,528),(1250,500),(1200,497),(1160,490),(1130,460),(1118,400)], pivot=(1240,495), garde=60),
   dict(nom="machoire", parent="tete", poly=[(1140,462),(1175,470),(1212,452),(1225,470),(1200,497),(1160,492),(1140,480)], pivot=(1222,458), dessous="creux", couleur=(120,40,30), garde=18),
   dict(nom="avant_bras", poly=[(1015,375),(1105,375),(1120,470),(1095,515),(1075,585),(1012,590),(1005,520)], pivot=(1045,580), garde=30),
 ],
 (2, "chapeau"): [dict(nom="tout", poly=None, pivot=(680,690), garde=0)],
 (3, "vendeur"): [
   dict(nom="tete", poly=[(120,430),(175,300),(250,290),(330,300),(440,340),(445,395),(420,420),(430,500),(420,560),(390,600),(350,600),(310,585),(270,550),(230,540),(160,490)], pivot=(350,590), garde=60),
   dict(nom="bras_tete", poly=[(360,395),(420,385),(460,410),(505,480),(505,540),(470,590),(420,625),(385,610),(410,570),(440,530),(430,490),(380,490),(355,440)], pivot=(415,600), dessous="peint", garde=40),
   dict(nom="bras_g", poly=[(50,650),(200,640),(290,600),(330,625),(300,670),(215,725),(190,760),(150,800),(50,790)], pivot=(310,630), garde=40),
 ],
}

def smooth01(x): x = np.clip(x, 0, 1); return x * x * (3 - 2 * x)

class Pantin:
    def __init__(self, n, a, rig):
        self.a = a; ch, cw = a.h + 2 * M, a.w + 2 * M; self.ox, self.oy = a.x0 - M, a.y0 - M
        self.size = (cw, ch)
        rgba = np.zeros((ch, cw, 4), np.float32); rgba[M:M + a.h, M:M + a.w] = np.asarray(a.im, np.float32)
        rgb, alpha = rgba[..., :3].copy(), rgba[..., 3] / 255.0
        full = np.asarray(Image.open(f"{R}/images/Scene_{n:02d}.jpg").convert("RGB").resize((A.IW, A.IH)))
        full = np.pad(full, ((M * 2, M * 2), (M * 2, M * 2), (0, 0)), mode="edge")
        orig = full[self.oy + 2 * M: self.oy + 2 * M + ch, self.ox + 2 * M: self.ox + 2 * M + cw]
        self.Y, self.X = np.mgrid[0:ch, 0:cw].astype(np.float32)
        body_a = alpha.copy(); self.couches = []; par_nom = {}
        for L in rig:
            px, py = L["pivot"][0] - self.ox, L["pivot"][1] - self.oy
            if L["poly"] is None: lm = np.ones((ch, cw), np.float32)
            else:
                lm = np.zeros((ch, cw), np.uint8)
                cv2.fillPoly(lm, [np.array([(x - self.ox, y - self.oy) for x, y in L["poly"]], np.int32)], 255)
                lm = cv2.GaussianBlur(lm, (5, 5), 0).astype(np.float32) / 255
            dist = np.hypot(self.X - px, self.Y - py)
            far = smooth01((dist - L.get("garde", 40)) / 24.0)
            mode = L.get("dessous", "vide")
            C = dict(nom=L["nom"], px=px, py=py, parent=L.get("parent"), rgb=rgb.copy(), a=alpha * lm,
                     dist=dist, ext=float((dist * (alpha * lm > .5)).max()) or 1.0)
            if mode == "vide": body_a = body_a * (1 - lm * far)
            behind = [c for c in self.couches if (c["a"] * lm).sum() > 50]
            if mode == "peint" and behind:
                hole = cv2.dilate(((alpha * lm) > .3).astype(np.uint8) * 255, np.ones((7, 7), np.uint8))
                inp = cv2.inpaint(orig.astype(np.uint8), hole, 7, cv2.INPAINT_TELEA).astype(np.float32)
                for c in behind:
                    w = (lm * far)[..., None]; c["rgb"] = c["rgb"] * (1 - w) + inp * w
            if mode == "creux" and L.get("parent"):
                c = par_nom[L["parent"]]; w = (lm * far)[..., None]
                c["rgb"] = c["rgb"] * (1 - w) + np.array(L["couleur"], np.float32) * w
            self.couches.append(C); par_nom[L["nom"]] = C
        self.body = np.dstack([rgb * body_a[..., None], body_a * 255]).astype(np.float32)        # prémultiplié
        for c in self.couches:
            c["pm"] = np.dstack([c["rgb"] * c["a"][..., None], c["a"] * 255]).astype(np.float32)
        self.cache = (None, None)

    def _warp(self, c, ang, bend, dx, dy):
        phi = math.radians(ang) + (math.radians(bend) * smooth01(c["dist"] / c["ext"]) if bend else 0.0)
        co, si = np.cos(phi), np.sin(phi)
        X, Y = self.X - c["px"] - dx, self.Y - c["py"] - dy
        mx = (c["px"] + co * X + si * Y).astype(np.float32); my = (c["py"] - si * X + co * Y).astype(np.float32)
        return cv2.remap(c["pm"], mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)

    def rendu(self, key, etat):
        if self.cache[0] == key: return self.cache[1]
        out = self.body.copy(); mats = {}
        for c in self.couches:
            ang, bend, dx, dy = (list(etat.get(c["nom"], (0, 0))) + [0, 0, 0])[:4]
            img = self._warp(c, ang, bend, dx, dy)
            Mx = cv2.getRotationMatrix2D((c["px"], c["py"]), -ang, 1.0); Mx[0, 2] += dx; Mx[1, 2] += dy
            if c["parent"]:
                Pm = mats[c["parent"]]; img = cv2.warpAffine(img, Pm, self.size, flags=cv2.INTER_LINEAR)
                Mx = (np.vstack([Pm, [0, 0, 1]]) @ np.vstack([Mx, [0, 0, 1]]))[:2]
            mats[c["nom"]] = Mx
            k = 1 - img[..., 3:4] / 255.0; out = img + out * k
        al = out[..., 3:4]; rgb = np.where(al > 1, out[..., :3] * 255.0 / np.maximum(al, 1), 0)
        im = Image.fromarray(np.dstack([rgb, al]).clip(0, 255).astype(np.uint8), "RGBA")
        f = type("F", (), {})(); f.im = im; f.w, f.h = im.size; f.x0, f.y0 = self.ox, self.oy
        f.cx = self.ox + f.w / 2; f.by = self.oy + f.h; f.name = self.a.name
        self.cache = (key, f); return f

# ---------------------------------------------------------------- jeu des marionnettes
def env(L, lid, t):
    if lid not in L: return 0.0
    st, du, _ = L[lid]; e = BOUCHE.get(lid, []); k = int((t - st) * 24)
    return min(1.0, e[k] * 1.15) if 0 <= k < len(e) else 0.0
def dans(L, lid, t, apres=0.0):
    return lid in L and L[lid][0] <= t < L[lid][0] + L[lid][1] + apres

def jeu(n, name, t, L):
    """renvoie (état des couches, mode de la racine ou None)"""
    if (n, name) == (2, "renard"):
        p = dans(L, "s02a", t); nar = dans(L, "s02c", t)
        return {"tete": (2.5 * sin(.45, t) + (3 * sin(2.1, t) if p else 0) - (4 if nar else 0), 0),
                "machoire": (15 * env(L, "s02a", t), 0),
                "bras": ((-5 - 5 * abs(sin(1.4, t))) if p else 1.5 * sin(.6, t), (4 * sin(1.4, t) if p else 0))}, "fige"
    if (n, name) == (2, "mouton"):
        rire = dans(L, "s02b", t, 1.6); k = 1.0 if dans(L, "s02b", t) else (.5 if rire else 0)
        return {"tete": (6 * k * sin(3.1, t) + 2 * sin(.4, t) + 4 * k, 0),
                "machoire": (-(5 + 5 * sin(6.2, t)) * k - 6 * env(L, "s02b", t), 0),
                "avant_bras": (10 * k * sin(2.6, t) + 3 * sin(.6, t), 3 * k * sin(2.6, t, 1))}, ("rire" if rire else "idle")
    if (n, name) == (2, "chapeau"):
        return {"tout": (0, 3.5 * sin(.8, t))}, None
    if (n, name) == (3, "vendeur"):
        return {"tete": (3 * sin(.7, t), 4 * sin(1.4, t, 1)), "bras_tete": (3.5 * sin(4.2, t), 2 * sin(4.2, t, .8)),
                "bras_g": (7 * sin(.9, t), 6 * sin(.9, t, -.7))}, "idle"
    return {}, None

_P = {}
def hook(n, name, a, t, L):
    rig = RIGS.get((n, name))
    if not rig: return None
    if (n, name) not in _P: _P[(n, name)] = Pantin(n, a, rig)
    tq = math.floor(t * 12) / 12
    etat, mode = jeu(n, name, tq, L)
    return _P[(n, name)].rendu(round(tq * 12), etat), mode

_prop = {}
def extra(n, canvas, t, L):
    if n != 3: return
    if "h" not in _prop: _prop["h"] = Image.open(f"{R}/travail/masques/S03_prop_chapeau.png")
    h = _prop["h"]
    for k, ph in enumerate((0.0, 1.45)):                      # chapeaux qui dégringolent de la pile
        u = ((t + ph) % 2.9) / 2.9
        x = 1000 - u * 470; y = 190 + u * u * 640 - abs(math.sin(u * math.pi * 3)) * 60 * (1 - u)
        im = h.rotate(-u * 540 * (1 if k == 0 else -1), resample=Image.BICUBIC, expand=True)
        canvas.paste(im, (int(x - im.width / 2), int(y - im.height / 2)), im)

A.HOOK = hook; A.EXTRA = extra

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--apercu" in args:
        args.remove("--apercu")
        for n in map(int, args): A.rendu(True, n, n)
    else:
        from multiprocessing import Pool
        with Pool(min(4, len(args))) as p: p.starmap(A.rendu, [(False, int(n), int(n)) for n in args])
