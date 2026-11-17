import subprocess, sys, time, os, glob, gc
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-U", "diffusers", "transformers", "accelerate", "ftfy", "imageio-ffmpeg", "sentencepiece", "gguf", "peft"], check=False)
subprocess.run([sys.executable, "-m", "pip", "uninstall", "-y", "-q", "torchao"], check=False)
import torch
from PIL import Image
from huggingface_hub import hf_hub_download
from diffusers import WanImageToVideoPipeline, WanTransformer3DModel, AutoencoderKLWan, GGUFQuantizationConfig
from diffusers.utils import export_to_video
MID = "Wan-AI/Wan2.2-I2V-A14B-Diffusers"; Q = "Q4_K_S"
def tr(kind, sub):
    f = hf_hub_download("QuantStack/Wan2.2-I2V-A14B-GGUF", f"{kind}Noise/Wan2.2-I2V-A14B-{kind}Noise-{Q}.gguf")
    return WanTransformer3DModel.from_single_file(f, quantization_config=GGUFQuantizationConfig(compute_dtype=torch.float16),
                                                  config=MID, subfolder=sub, torch_dtype=torch.float16)
TDEV = "cuda:1" if torch.cuda.device_count() > 1 else "cuda:0"
NEG = "static, blurry, text, subtitles, watermark, deformed, distorted face, morphing, extra limbs"
PROMPTS = {
 "1": "The fox behind the counter presents three identical decorated boxes with an elegant sweeping gesture and talks with a sly smile. The sheep leans forward, curious, rubbing his chin, his eyes going from box to box.",
 "2": "The sheep confidently points at the middle box and nods proudly, very sure of himself. The fox gestures toward the boxes and smiles knowingly, his tail swaying.",
 "3": "The fox lifts the lids of the three boxes, revealing exactly the same cookies inside. The sheep leans in, stunned, eyes wide, then scratches his head in confusion.",
 "4": "The fox turns the knob of the old wooden television on the counter; the screen flickers on with a black-and-white picture. The sheep stares at the screen with curiosity, leaning closer.",
 "5": "Black and white. The salesman proudly presents a single jar on a velvet cushion like a precious treasure, sweeping his hand, while a spotlight shines down on it and sparkles twinkle around it.",
 "6": "Black and white. The salesman gestures toward three jars; the middle one is fancier and glows. The customer in the flat cap rushes toward the middle jar, excited, reaching for it with both hands.",
 "7": "Black and white. The salesman presents three hats on the counter: a luxurious top hat, a simple hat and a reasonable middle hat. The customer hesitates, then reaches happily for the middle hat.",
 "8": "Black and white. A salesman on a parade truck shouts through a megaphone and raises the product high; the cheering crowd jumps, waves and holds up the same jar with excitement.",
 "9": "Black and white. A spotlight shines on a single jar on a pedestal. The salesman gestures toward it with a charming smile; the elegant woman puts her hand to her chest, dazzled, and leans toward it.",
 "10": "Black and white. The customer walks happily along the shop path following the painted arrows on the floor toward the glowing product on a pedestal at the end; the arrows blink one after another.",
 "11": "Black and white. The decorations fade and the three jars become perfectly identical and plain. The salesman smiles awkwardly; the customer scratches his head with a question mark above him, confused.",
 "12": "Black and white. In the town square, everyone looks at the same plain jar in their hands; they turn to each other, embarrassed and puzzled, shrugging and exchanging awkward glances.",
 "13": "The sheep, shocked, points at himself with wide eyes and an open mouth. The fox answers calmly with a sly smile, his hand resting on the counter, tail swaying.",
 "14": "The fox places the middle box on a pedestal under a warm spotlight with a theatrical gesture. The sheep's eyes light up and he eagerly reaches out his hand toward the glowing box.",
 "15": "The sheep happily walks away hugging his box, bouncing with each step. The fox turns his head toward the camera and gives a slow sly wink."
}
STYLE = " 1930s rubber hose cartoon animation. Characters stay on model with consistent faces. Static camera. No text."
# 1) texte seul (puis libéré)
from transformers import UMT5EncoderModel, AutoTokenizer
te = UMT5EncoderModel.from_pretrained(MID, subfolder="text_encoder", torch_dtype=torch.float16, low_cpu_mem_usage=True).to(TDEV)
p0 = WanImageToVideoPipeline.from_pretrained(MID, text_encoder=te, tokenizer=AutoTokenizer.from_pretrained(MID, subfolder="tokenizer"),
                                             transformer=None, transformer_2=None, vae=None)
EMB = {}
with torch.no_grad():
    for n, p in PROMPTS.items(): EMB[n] = p0.encode_prompt(prompt=p + STYLE, negative_prompt=NEG, do_classifier_free_guidance=False, device=TDEV)[0].to("cpu")
del p0, te; gc.collect(); torch.cuda.empty_cache()
print("texte encodé", flush=True)
# 2) modèles vidéo
t0 = time.time()
vae = AutoencoderKLWan.from_pretrained(MID, subfolder="vae", torch_dtype=torch.float32)
pipe = WanImageToVideoPipeline.from_pretrained(MID, vae=vae, text_encoder=None, tokenizer=None, transformer=tr("High", "transformer"),
                                               transformer_2=tr("Low", "transformer_2"), torch_dtype=torch.float16)
L = "lightx2v/Wan2.2-Lightning"; D = "Wan2.2-I2V-A14B-4steps-lora-rank64-Seko-V1"
pipe.load_lora_weights(L, weight_name=f"{D}/high_noise_model.safetensors", adapter_name="hi")
pipe.load_lora_weights(L, weight_name=f"{D}/low_noise_model.safetensors", adapter_name="lo", load_into_transformer_2=True)
print("chargé en", round(time.time() - t0), "s", flush=True)
pipe.enable_model_cpu_offload(gpu_id=0)
try: pipe.vae.enable_tiling()
except Exception as e: print("tiling", e)
for n in sorted(PROMPTS, key=int):
    t0 = time.time()
    try:
        src = glob.glob(f"/kaggle/input/**/Scene_{int(n):02d}.jpg", recursive=True)[0]
        img = Image.open(src).convert("RGB").resize((640, 480), Image.LANCZOS)
        out = pipe(image=img, prompt_embeds=EMB[n].to("cuda:0"), height=480, width=640, num_frames=81, guidance_scale=1.0, guidance_scale_2=1.0,
                   num_inference_steps=4, generator=torch.Generator("cpu").manual_seed(7)).frames[0]
        export_to_video(out, f"/kaggle/working/Scene_{int(n):02d}.mp4", fps=16)
        print("scene", n, "OK en", round(time.time() - t0), "s", flush=True)
    except Exception as e:
        print("scene", n, "ERREUR", repr(e)[:300], flush=True); gc.collect(); torch.cuda.empty_cache()
print("FINI", flush=True)
