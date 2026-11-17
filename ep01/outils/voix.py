"""EP04 — voix avec Chatterbox multilingue (CPU). La « foule » = 3 voix mélangées.

Usage : /root/venvs/cb/bin/python outils/voix.py [id ...]   -> voix/<id>.wav
Les répliques déjà générées ne sont pas refaites (supprimer le fichier pour régénérer).
"""
import json, os, subprocess, sys, time
import torch, torchaudio

_load = torch.load
torch.load = lambda *a, **k: _load(*a, **{**k, "map_location": "cpu"})
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
torch.set_num_threads(os.cpu_count() or 4)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# référence, exagération (énergie), cfg (bas = débit plus vivant)
JEU = {"narr": ("eleven-jt", 0.7, 0.4), "renard": ("eleven-renard", 0.6, 0.45), "mouton": ("eleven-mouton", 0.7, 0.45),
       "vendeur": ("vendeur", 0.75, 0.4), "client": ("client", 0.7, 0.45), "passant": ("passant", 0.7, 0.45),
       "passante": ("passante", 0.7, 0.45)}
FOULE = ["client", "vendeur", "passant"]

lines = json.load(open(f"{R}/lignes.json"))
only = sys.argv[1:]
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")

SEED = int(os.environ.get("SEED", "1930"))
def say(text, who, out, seed=None):
    seed = SEED if seed is None else seed
    ref, ex, cfg = JEU[who]
    torch.manual_seed(seed)
    wav = model.generate(text, language_id="fr", audio_prompt_path=f"{R}/voix/refs/ref-{ref}.wav",
                         exaggeration=ex, cfg_weight=cfg, temperature=0.75)
    torchaudio.save(out, wav, model.sr)

for L in lines:
    if only and L["id"] not in only: continue
    out = f"{R}/voix/{L['id']}.wav"
    if os.path.exists(out): continue
    t0 = time.time()
    if L["who"] == "foule":
        parts = []
        for i, w in enumerate(FOULE):
            f = f"{R}/voix/{L['id']}_{w}.wav"; say(L["text"], w, f, 1930 + i); parts.append(f)
        # trois voix décalées de quelques ms + léger écho de foule
        inp = sum([["-i", f] for f in parts], [])
        fc = "[1]adelay=90|90[b];[2]adelay=170|170[c];[0][b][c]amix=inputs=3:normalize=0,aecho=0.8:0.6:40:0.25,volume=0.8"
        subprocess.run(["ffmpeg", "-y", "-v", "error", *inp, "-filter_complex", fc, out], check=True)
        for f in parts: os.remove(f)
    else:
        say(L["text"], L["who"], out)
    print(f"{time.time() - t0:5.1f}s  {L['id']}  {L['who']:8s} {L['text'][:45]}", flush=True)
