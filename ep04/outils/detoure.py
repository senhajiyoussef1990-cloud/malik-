"""Détourage des acteurs de chaque scène avec SAM (facebook/sam-vit-base, CPU).

Usage : /root/venvs/sd/bin/python outils/detoure.py [1 2 ...]  -> travail/masques/S<n>_<acteur>.png
"""
import json, os, sys
import numpy as np, torch
from PIL import Image
from transformers import SamModel, SamProcessor

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SC = json.load(open(f"{R}/scenes.json"))
torch.set_num_threads(4)
proc = SamProcessor.from_pretrained("/root/models/sam"); model = SamModel.from_pretrained("/root/models/sam").eval()
os.makedirs(f"{R}/travail/masques", exist_ok=True)
for n in sys.argv[1:] or [k for k in SC if not k.startswith("_")]:
    im = Image.open(f"{R}/images/Scene_{int(n):02d}.jpg").convert("RGB")
    inp = proc(im, return_tensors="pt")
    with torch.no_grad(): emb = model.get_image_embeddings(inp["pixel_values"])
    for name, box in SC[n]["acteurs"].items():
        x0, y0, x1, y1 = box
        pt = [[(x0 + x1) / 2, (y0 + y1) / 2]]
        i2 = proc(im, input_boxes=[[box]], return_tensors="pt")
        with torch.no_grad():
            out = model(image_embeddings=emb, input_boxes=i2["input_boxes"], multimask_output=True)
        masks = proc.image_processor.post_process_masks(out.pred_masks, i2["original_sizes"], i2["reshaped_input_sizes"])[0][0]
        k = int(out.iou_scores[0, 0].argmax())
        m = masks[k].numpy().astype(np.uint8) * 255
        Image.fromarray(m).save(f"{R}/travail/masques/S{int(n):02d}_{name}.png")
        print(f"S{n} {name:9s} score={float(out.iou_scores[0,0,k]):.2f} couverture={m.mean()/255:.3f}", flush=True)
