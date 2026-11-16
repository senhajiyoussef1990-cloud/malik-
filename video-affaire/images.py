"""Images « dessin animé années 30 » générées localement sur CPU.

Moteur : leejet/stable-diffusion.cpp (sd-cli) + FLUX.1-schnell (GGUF Q4_0)
Style  : LoRA « Wizard's Vintage Rubber Hose Animation Style » (OpenRAIL++)

Usage : python3 images.py [n01 ...] [--seed N]    -> clips/<id>.png
"""
import json, os, subprocess, sys, time

P = os.path.dirname(os.path.abspath(__file__))
SD = os.environ.get("SD_CLI", "/root/sdcpp/build/bin/sd-cli")
M = os.environ.get("FLUX_DIR", "/root/models/flux")
SC = json.load(open(f"{P}/scenes.json"))
LORA = "wizards-vintage-rubber-hose-animation-style"

def prompt(sid):
    p = SC[sid]["prompt"].replace("{mouton}", SC["_mouton"]).replace("{renard}", SC["_renard"])
    return f"<lora:{LORA}:0.9>" + SC["_style"] + p

def gen(sid, seed):
    out = f"{P}/clips/{sid}.png"
    cmd = [SD, "--diffusion-model", f"{M}/flux1-schnell-Q4_0.gguf", "--vae", f"{M}/ae.safetensors",
           "--clip_l", f"{M}/clip_l.safetensors", "--t5xxl", f"{M}/t5-v1_1-xxl-encoder-Q4_K_S.gguf",
           "--lora-model-dir", M, "-p", prompt(sid), "--cfg-scale", "1.0", "--sampling-method", "euler",
           "--steps", "4", "-W", "768", "-H", "432", "-s", str(seed), "-t", str(os.cpu_count() or 4),
           "--vae-tiling", "-o", out]
    t0 = time.time()
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode or not os.path.exists(out):
        print(r.stdout[-1500:], r.stderr[-1500:]); raise SystemExit(1)
    print(f"{time.time() - t0:6.1f}s  {sid}", flush=True)

if __name__ == "__main__":
    args = sys.argv[1:]; seed = 7
    if "--seed" in args:
        i = args.index("--seed"); seed = int(args[i + 1]); del args[i:i + 2]
    os.makedirs(f"{P}/clips", exist_ok=True)
    for sid in args or sorted(k for k in SC if not k.startswith("_")):
        gen(sid, seed)
