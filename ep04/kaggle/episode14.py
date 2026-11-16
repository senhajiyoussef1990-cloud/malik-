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
 "1": "The cheerful sheep walks into the hat shop through the open door with a bouncy step, looking around happily. The fox behind the counter watches him with a sly half-smile, his tail swaying slowly. On the shelf, the giant golden three-pointed jester hat wobbles slightly and its bells jingle. Near the end, the sheep stops, puts a hand on his chest and talks proudly, shaking his head as if saying \"nobody influences me\". Warm lamps flicker gently.",
 "2": "The fox pats the giant golden jester hat on the counter and gestures toward it while talking, with a calculating smile. The sheep bursts out laughing: head thrown back, eyes closed, one hand on his belly, the other hand waving, his whole body shaking and bouncing with laughter. The hat's points sway and the bells swing. At the end the fox glances sideways toward the camera with a knowing look while the sheep keeps chuckling.",
 "3": "Black and white. The salesman scratches his head in distress, sweat drops flying from his forehead, his knees trembling. He looks up and down at the huge mountain of unsold jester hats. A few hats tumble and roll down the pile toward the floor. He sighs deeply and his shoulders drop. Slow push-in toward the salesman.",
 "4": "Black and white. The light bulb above the salesman's head flashes on and glows with rays. Standing on the stool, he excitedly hangs the sign \"LA NOUVELLE MODE\" on its hook, straightens it, then turns his head and talks with a mischievous grin, raising one finger. The sign swings gently. The young man in the flat cap watches, clasps his hands and bounces with delight.",
 "5": "Black and white. The man wearing the ridiculous jester hat struts proudly down the cobblestone street with a bouncy rubber-hose walk, swinging his arms, the hat's points bobbing. The pedestrians on both sides watch him, giggle, cover their mouths and whisper to each other. The man on the right tips his hat and points at the jester hat while speaking, amused.",
 "6": "Black and white. Four men wearing identical jester hats march in a line down the street in perfect bouncy rhythm, hats bobbing together, little dust puffs at their feet. The onlookers in the background go from laughing to staring with curiosity. The woman at the shop window leans forward, eyes wide, puts a hand to her cheek and speaks excitedly, pointing at the hats.",
 "7": "Black and white. The salesman rings up sales on the ornate cash register: the keys jump, the drawer pops open, the register shakes and rattles with each sale. The young customer at the front of the queue bounces with excitement, fists clenched, and speaks eagerly. Behind him, the long line of customers shuffles forward impatiently, craning their necks.",
 "8": "Black and white. Wide view of the town square: everyone strolls around wearing the same jester hat, couples walking arm in arm, hats bobbing everywhere, the fountain flowing. In the middle, the one man in an ordinary flat cap looks left and right in confusion, scratching his head and shrugging. Slow pull-back of the camera.",
 "9": "Black and white. The crowd in jester hats points at the man in the flat cap and roars with mocking laughter, slapping their knees, heads thrown back. The man blushes, sweats, looks around in embarrassment, then dashes off at full speed toward the open door of the hat shop, legs spinning, leaving puffs of dust behind him.",
 "10": "Black and white. The salesman, wearing an ordinary fedora, swims joyfully through a sea of banknotes like in a pool, doing strokes with his arms and kicking his feet, laughing triumphantly with his head thrown back. Banknotes fly up and rain down all around him. He tosses handfuls of bills into the air. Empty hat boxes wobble.",
 "11": "Black and white. The man wearing the enormous jester hat studies his reflection in the shop window, rubbing his chin. He tilts his head left and right; the reflection copies him. The question mark above his head bounces. The giant hat's points droop and sway. He frowns, puzzled, and mutters to himself with a doubtful look. Slow push-in.",
 "12": "Black and white. The man in suspenders holds up the jester hat he just took off and asks the crowd a question with an open, honest gesture. Everyone freezes. The people in jester hats exchange embarrassed side glances, shuffle their feet, cough, look at the ground. The salesman raises both hands nervously and sweats. A long awkward silence; only small nervous movements.",
 "13": "The sheep rubs his chin and frowns, thinking hard, looking at the big golden jester hat on the counter, then turns to the fox and asks a hesitant question. The fox, hands behind his back, answers calmly with a sly smile and a small nod, his tail swaying. On the shelf, the small old television flickers with a black-and-white picture. Warm lamp light flickers softly.",
 "14": "The fox turns the golden jester hat and shows off the \"BEST-SELLER\" tag, which swings on its string, while talking smoothly. The sheep's eyes go wide; he leans forward, bouncing with sudden excitement, fists clenched, and asks eagerly. The fox then looks sideways toward the camera with a knowing, satisfied smirk and raises one eyebrow.",
 "15": "The sheep, laughing happily, digs coins out of his wallet and reaches toward the counter to pay for the jester hat. The fox keeps one hand on the hat, slowly turns his head toward the camera and gives a big slow wink with a sly grin. For the last three seconds everything freezes completely still, like a freeze-frame."
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
