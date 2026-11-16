"""Génère les éléments du dessin animé avec FLUX (stable-diffusion.cpp, CPU) puis détoure les personnages.

Usage : python3 assets.py [nom ...]     -> assets/<nom>.png  (personnages : PNG transparent)
Les éléments déjà présents ne sont pas régénérés.
"""
import json, os, subprocess, sys, time
import numpy as np
from PIL import Image, ImageFilter

P = os.path.dirname(os.path.abspath(__file__))
SD = os.environ.get("SD_CLI", "/root/sdcpp/build/bin/sd-cli")
M = os.environ.get("FLUX_DIR", "/root/models/flux")
A = json.load(open(f"{P}/assets.json"))
LORA = "wizards-vintage-rubber-hose-animation-style"

def prompt(name):
    p = A[name]["prompt"]
    for k in ("mouton", "renard", "perso", "decor"):
        p = p.replace("{" + k + "}", A["_" + k])
    return f"<lora:{LORA}:0.9>" + A["_style"] + p

def detoure(src, dst):
    """fond blanc -> transparent (remplissage depuis les bords)"""
    im = Image.open(src).convert("L")
    a = np.asarray(im)
    from collections import deque
    h, w = a.shape; bg = np.zeros((h, w), bool); q = deque()
    for x in range(w): q.extend([(0, x), (h - 1, x)])
    for y in range(h): q.extend([(y, 0), (y, w - 1)])
    while q:
        y, x = q.popleft()
        if 0 <= y < h and 0 <= x < w and not bg[y, x] and a[y, x] > 225:
            bg[y, x] = True; q.extend([(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)])
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    out = im.convert("RGBA"); out.putalpha(alpha)
    out = out.crop(out.getbbox())
    out.save(dst)

def gen(name, seed=7):
    os.makedirs(f"{P}/assets", exist_ok=True)
    dst = f"{P}/assets/{name}.png"
    if os.path.exists(dst): return
    raw = f"{P}/assets/{name}.raw.png"
    w, h = A[name]["w"], A[name]["h"]
    cmd = [SD, "--diffusion-model", f"{M}/flux1-schnell-Q4_0.gguf", "--vae", f"{M}/ae.safetensors",
           "--clip_l", f"{M}/clip_l.safetensors", "--t5xxl", f"{M}/t5-v1_1-xxl-encoder-Q4_K_S.gguf",
           "--lora-model-dir", M, "-p", prompt(name), "--cfg-scale", "1.0", "--sampling-method", "euler",
           "--steps", "4", "-W", str(w), "-H", str(h), "-s", str(seed), "-t", str(os.cpu_count() or 4),
           "--vae-tiling", "-o", raw]
    t0 = time.time()
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode or not os.path.exists(raw):
        print(name, "ÉCHEC", r.stderr[-800:], flush=True); return
    if name.startswith("decor"):
        Image.open(raw).convert("L").convert("RGB").save(dst); os.remove(raw)
    else:
        detoure(raw, dst)
    print(f"{time.time() - t0:6.1f}s  {name}", flush=True)

if __name__ == "__main__":
    names = sys.argv[1:] or [k for k in A if not k.startswith("_")]
    for n in names: gen(n)
