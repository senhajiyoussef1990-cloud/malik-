import subprocess, sys, time, os, glob
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-U", "diffusers", "transformers", "accelerate", "ftfy", "imageio-ffmpeg", "sentencepiece"], check=False)
print(subprocess.run(["nvidia-smi", "--query-gpu=name,memory.total", "--format=csv"], capture_output=True, text=True).stdout, flush=True)
print(glob.glob("/kaggle/input/**/*.jpg", recursive=True)[:3], flush=True)
import torch
from PIL import Image
from diffusers import WanImageToVideoPipeline, AutoencoderKLWan
from diffusers.utils import export_to_video
MID = "Wan-AI/Wan2.2-TI2V-5B-Diffusers"
t0 = time.time()
vae = AutoencoderKLWan.from_pretrained(MID, subfolder="vae", torch_dtype=torch.float32)
pipe = WanImageToVideoPipeline.from_pretrained(MID, vae=vae, torch_dtype=torch.float16)
print("GPU :", torch.cuda.device_count(), flush=True)
TDEV = "cuda:1" if torch.cuda.device_count() > 1 else "cuda:0"
def encode(p, n):
    pipe.text_encoder.to(TDEV)
    with torch.no_grad():
        pe, ne = pipe.encode_prompt(prompt=p, negative_prompt=n, do_classifier_free_guidance=True, device=TDEV)
    return pe.to("cuda:0"), ne.to("cuda:0")
try: pipe.vae.enable_tiling()
except Exception as e: print("tiling", e)
print("chargé en", round(time.time() - t0), "s", flush=True)
src = glob.glob("/kaggle/input/**/Scene_02.jpg", recursive=True)[0]
img = Image.open(src).convert("RGB").resize((768, 576), Image.LANCZOS)
NEG = "static, still image, blurry, text, subtitles, watermark, deformed, distorted face, extra limbs, low quality"
P = ("1930s rubber hose cartoon animation. The fox pats the big golden jester hat on the counter and talks with a sly smile. "
     "The sheep laughs out loud, head thrown back, shaking with laughter, one hand on his belly, the other hand waving. "
     "The hat's points sway. Static camera, smooth bouncy cartoon motion, consistent character designs.")
PE, NE = encode(P, NEG)
pipe.text_encoder.to("cpu"); pipe.text_encoder = None
import gc; gc.collect(); torch.cuda.empty_cache()
pipe.enable_model_cpu_offload(gpu_id=0)
t0 = time.time()
out = pipe(image=img, prompt_embeds=PE, negative_prompt_embeds=NE, height=576, width=768, num_frames=73, guidance_scale=5.0,
           num_inference_steps=25, generator=torch.Generator("cpu").manual_seed(7)).frames[0]
print("généré en", round(time.time() - t0), "s", flush=True)
export_to_video(out, "/kaggle/working/Scene_02.mp4", fps=24)
print("OK", flush=True)
