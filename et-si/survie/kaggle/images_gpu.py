# Notebook Kaggle (GPU) : images réalistes pour « Et si ? » avec SDXL (RealVisXL).
# Les prompts sont injectés par le workflow GitHub (marqueur ci-dessous).
import json, os, subprocess, sys, time
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-U", "diffusers", "accelerate", "safetensors"], check=True)
import torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler
P = json.loads(r'''__PROMPTS__''')
MODEL = P.get("_modele", "SG161222/RealVisXL_V4.0")
pipe = StableDiffusionXLPipeline.from_pretrained(MODEL, torch_dtype=torch.float16, variant="fp16", use_safetensors=True)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)
pipe.to("cuda"); pipe.enable_vae_tiling()
NEG = P.get("_negatif", "")
os.makedirs("/kaggle/working/images", exist_ok=True)
for st, style in P["_styles"].items():
    for k, p in P["images"].items():
        t0 = time.time()
        g = torch.Generator("cuda").manual_seed(P.get("_seed", 11))
        img = pipe(prompt=style + p.replace("{perso}", P["_personnage"]), negative_prompt=NEG, width=768, height=1344,
                   num_inference_steps=P.get("_steps", 30), guidance_scale=P.get("_cfg", 5.0), generator=g).images[0]
        img.save(f"/kaggle/working/images/{st}_{k}.png")
        print(f"{time.time() - t0:5.1f}s {st}_{k}", flush=True)
