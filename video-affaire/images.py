"""Images « dessin animé années 30 » générées localement (Stable Diffusion 1.5, CPU ~2 min/image).

Usage : /root/venvs/sd/bin/python images.py [n01 ...]      -> clips/<id>.png (1024x576)
Modèle : CalypsoCrunchies99/1930sCartoonRichstyle_ocds_vaefix (Hugging Face) via huggingface/diffusers
"""
import json, os, sys, time
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler

P = os.path.dirname(os.path.abspath(__file__))
MODEL = "/root/models/sd1930"
STYLE = "ocds style, monochrome, black and white 1930s rubber hose cartoon, grayscale, old film still, "
NEG = "color, colorful, yellow, green, purple, photo, realistic, 3d, text, watermark, blurry, deformed"
SCENES = json.load(open(f"{P}/scenes.json"))

torch.set_num_threads(os.cpu_count() or 4)
pipe = StableDiffusionPipeline.from_pretrained(MODEL, torch_dtype=torch.float32, safety_checker=None,
                                               requires_safety_checker=False)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)
pipe.set_progress_bar_config(disable=True)

ids = sys.argv[1:] or sorted(SCENES)
os.makedirs(f"{P}/clips", exist_ok=True)
for sid in ids:
    t0 = time.time()
    g = torch.Generator().manual_seed(SCENES[sid].get("seed", 7))
    img = pipe(STYLE + SCENES[sid]["prompt"], negative_prompt=NEG, width=768, height=432,
               num_inference_steps=20, guidance_scale=7, generator=g).images[0]
    img = img.convert("L").convert("RGB").resize((1024, 576))
    img.save(f"{P}/clips/{sid}.png")
    print(f"{time.time() - t0:5.1f}s  {sid}", flush=True)
