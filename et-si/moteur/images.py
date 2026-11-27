"""Images FLUX.1-schnell (stable-diffusion.cpp, CPU) à partir d'un fichier de prompts.
Usage : python images.py prompts.json sortie/ [--seed 11] [--w 640 --h 1152]"""
import json, os, subprocess, sys, time, argparse
ap = argparse.ArgumentParser(); ap.add_argument('prompts'); ap.add_argument('out')
ap.add_argument('--seed', type=int, default=11); ap.add_argument('--w', type=int, default=640); ap.add_argument('--h', type=int, default=1152)
a = ap.parse_args()
SD = os.environ['SD_CLI']; M = os.environ['FLUX_DIR']
P = json.load(open(a.prompts)); os.makedirs(a.out, exist_ok=True)
for st, style in P['_styles'].items():
    for k, p in P['images'].items():
        out = f'{a.out}/{st}_{k}.png'
        prompt = style + p.replace('{perso}', P['_personnage'])
        cmd = [SD, '--diffusion-model', f'{M}/flux1-schnell-Q4_0.gguf', '--vae', f'{M}/ae.safetensors',
               '--clip_l', f'{M}/clip_l.safetensors', '--t5xxl', f'{M}/t5-v1_1-xxl-encoder-Q4_K_S.gguf',
               '-p', prompt, '--cfg-scale', '1.0', '--sampling-method', 'euler', '--steps', '4',
               '-W', str(a.w), '-H', str(a.h), '-s', str(a.seed), '-t', str(os.cpu_count() or 4), '--vae-tiling', '-o', out]
        t0 = time.time(); r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode or not os.path.exists(out):
            print(r.stdout[-2000:], r.stderr[-2000:]); sys.exit(1)
        print(f'{time.time() - t0:6.1f}s  {st}_{k}', flush=True)
