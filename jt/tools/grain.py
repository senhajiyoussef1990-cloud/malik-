"""Génère les images de grain de vieux film (jt/grain/g0..g7.png)."""
import os, sys
import numpy as np
from PIL import Image

out = os.path.join(os.path.dirname(__file__), "..", "grain")
os.makedirs(out, exist_ok=True)
rs = np.random.default_rng(42)
for i in range(8):
    n = rs.normal(0.0, 1.0, (960, 540))
    v = np.clip(205 + n * 36, 0, 255).astype(np.uint8)   # gris clair, mode multiply
    img = Image.fromarray(v, "L").convert("RGB")
    img.save(os.path.join(out, f"g{i}.jpg"), quality=80)
print("ok")
