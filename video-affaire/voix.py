"""Voix naturelles avec Chatterbox multilingue (clonage à partir d'un court extrait, CPU).

Usage : /root/venvs/cb/bin/python voix.py [id ...]
Références : voices/ref-renard.wav, voices/ref-mouton.wav, voices/ref-narrateur.wav
Sortie : audio/<id>.mp3 (+ audio/<id>.json produit ensuite par minutage.py)
"""
import json, os, subprocess, sys, time
import torch, torchaudio

_load = torch.load
torch.load = lambda *a, **k: _load(*a, **{**k, "map_location": "cpu"})
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
torch.set_num_threads(os.cpu_count() or 4)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

P = os.path.dirname(os.path.abspath(__file__))
# exagération (expressivité), cfg (bas = débit plus posé)
JEU = {"renard": (0.6, 0.4), "mouton": (0.75, 0.5), "narr": (0.45, 0.35)}
REF = {"renard": "ref-renard.wav", "mouton": "ref-mouton.wav", "narr": "ref-narrateur.wav"}

lines = json.load(open(f"{P}/lines.json"))
only = sys.argv[1:]
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
os.makedirs(f"{P}/audio", exist_ok=True)
for L in lines:
    if only and L["id"] not in only: continue
    t0 = time.time(); ex, cfg = JEU[L["who"]]
    torch.manual_seed(1930)
    wav = model.generate(L["text"], language_id="fr", audio_prompt_path=f"{P}/voices/{REF[L['who']]}",
                         exaggeration=ex, cfg_weight=cfg, temperature=0.7)
    tmp = f"{P}/audio/{L['id']}.wav"
    torchaudio.save(tmp, wav, model.sr)
    # coupe les silences de début/fin, encode en mp3
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-b:a", "160k", f"{P}/audio/{L['id']}.mp3"], check=True)
    os.remove(tmp)
    print(f"{time.time() - t0:5.1f}s  {L['id']}  {L['text'][:50]}", flush=True)
