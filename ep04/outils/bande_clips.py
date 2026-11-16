#!/usr/bin/env python3
"""Construit la bande vidéo de l'épisode à partir des plans animés par IA (kaggle/clips/Scene_XX.mp4).

- recalcule le minutage (pauses raccourcies, voix à vitesse naturelle) -> travail/plans.json
- étire chaque plan sur la durée de sa scène (ralenti doux, puis aller-retour si nécessaire)
- scènes 3 à 12 en noir et blanc ; plongée dans le téléviseur (scène 3) et sortie (scène 13)
Usage : python3 outils/bande_clips.py   -> travail/bande.mp4 (1080x810, 30 i/s)
"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import anime as A

R = A.R; BW, BH, FPS = A.BW, A.BH, 30
CLIPS = f"{R}/kaggle/clips"; LEAD, TV, PAUSE, RALENTI = 0.35, 1.4, 0.75, 1.6
TELE = (1154, 192, 1310, 308)          # écran du téléviseur dans Scene_13 (image 1448x1086)

def plan():
    mn = json.load(open(f"{R}/travail/minutage.json")); lignes = json.load(open(f"{R}/lignes.json"))
    out, t = [], 0.0
    for n in range(1, 16):
        local = LEAD + (TV if n in (3, 13) else 0); ls = {}
        for l in [x for x in lignes if x["scene"] == n]:
            du = mn[l["id"]]["dur"]; ls[l["id"]] = (local, du, l["who"]); local += du + l["pause"] * PAUSE
        d = max(local + 0.15, 5.0); out.append({"n": n, "t0": t, "dur": d, "lignes": ls}); t += d
    json.dump(out, open(f"{R}/travail/plans.json", "w"), indent=1); return out

def frames(n):
    f = f"{CLIPS}/Scene_{n:02d}.mp4"
    if not os.path.exists(f):            # plan manquant : image fixe
        im = np.asarray(Image.open(f"{R}/images/Scene_{n:02d}.jpg").convert("RGB").resize((BW, BH), Image.LANCZOS))
        return [im], 5.0
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", f"scale={BW}:{BH}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, BH, BW, 3)
    fps = eval(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", f],
                              capture_output=True, text=True).stdout.strip() or "16")
    return list(a), len(a) / fps

def image_a(fr, C, t, T):
    if len(fr) == 1: return fr[0].astype(np.float32)
    s = max(1.0, min(T / C, RALENTI)); u = t / s
    if T > C * s + 1e-6: u = u % (2 * C); u = u if u < C else 2 * C - u      # aller-retour
    x = min(max(u / C * (len(fr) - 1), 0), len(fr) - 1); i = int(x); k = x - i
    j = min(i + 1, len(fr) - 1)
    return fr[i].astype(np.float32) * (1 - k) + fr[j].astype(np.float32) * k

def tele(dedans, k):
    """zoom entre la boutique (Scene_13) et l'écran du téléviseur ; k = 0 boutique, 1 plein écran"""
    base = Image.open(f"{R}/images/Scene_13.jpg").convert("RGB").resize((A.IW, A.IH), Image.LANCZOS)
    x0, y0, x1, y1 = TELE
    scr = Image.fromarray(dedans.astype(np.uint8)).convert("L").convert("RGB").resize((x1 - x0, y1 - y0))
    base.paste(scr, (x0, y0))
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2; zf = A.IW / (x1 - x0); z = zf ** k; w, h = A.IW / z, A.IH / z
    m = (1 - 1 / z) / (1 - 1 / zf)                      # le téléviseur reste dans le cadre pendant tout le zoom
    lx = min(max(A.IW / 2 + (cx - A.IW / 2) * m, w / 2), A.IW - w / 2); ly = min(max(A.IH / 2 + (cy - A.IH / 2) * m, h / 2), A.IH - h / 2)
    return np.asarray(base.resize((BW, BH), Image.BILINEAR, box=(lx - w / 2, ly - h / 2, lx + w / 2, ly + h / 2)), np.float32)

def main():
    P = plan(); print("durée totale :", round(sum(s["dur"] for s in P), 1), "s", flush=True)
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{BW}x{BH}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", f"{R}/travail/bande.mp4"], stdin=subprocess.PIPE)
    prev_last = None
    for s in P:
        n, T = s["n"], s["dur"]; fr, C = frames(n); nb = 3 <= n <= 12
        tv = TV if n in (3, 13) else 0.0
        for i in range(int(round(T * FPS))):
            t = i / FPS
            if n == 3 and t < tv:   im = tele(fr[0], A.ease(t / tv)); couleur = True
            elif n == 13 and t < tv: im = tele(prev_last, 1 - A.ease(t / tv)); couleur = True
            else:
                im = image_a(fr, C, t - tv, T - tv); couleur = not nb
                if nb: im = np.repeat(im.mean(axis=2, keepdims=True), 3, axis=2)
            ff.stdin.write(A.pellicule(Image.fromarray(im.clip(0, 255).astype(np.uint8)), s["t0"] + t, couleur).tobytes())
        prev_last = image_a(fr, C, T - tv, T - tv)
        print(f"  S{n:02d} {T:5.1f}s ({'plan IA' if len(fr) > 1 else 'IMAGE FIXE'})", flush=True)
    ff.stdin.close(); ff.wait()

if __name__ == "__main__": main()
