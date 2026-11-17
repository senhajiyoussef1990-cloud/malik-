"""Génère une réplique avec plusieurs graines et garde celle que Whisper comprend le mieux.
Usage : /root/venvs/cb/bin/python outils/meilleure_voix.py s10b s08a   (essais dans travail/essais/)"""
import json, os, subprocess, sys, difflib, torch, torchaudio
_l = torch.load; torch.load = lambda *a, **k: _l(*a, **{**k, "map_location": "cpu"})
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = {l["id"]: l for l in json.load(open(f"{R}/lignes.json"))}
REF = {"narr": "eleven-jt", "renard": "eleven-renard", "mouton": "eleven-mouton"}
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu"); os.makedirs(f"{R}/travail/essais", exist_ok=True)
for lid in sys.argv[1:]:
    for seed in (1931, 1932, 1933, 1934):
        torch.manual_seed(seed)
        w = m.generate(os.environ.get("TEXTE") or L[lid]["text"], language_id="fr", audio_prompt_path=f"{R}/voix/refs/ref-{REF[L[lid]['who']]}.wav",
                       exaggeration=0.6, cfg_weight=0.5, temperature=0.65)
        torchaudio.save(f"{R}/travail/essais/{lid}_{seed}.wav", w, m.sr); print("ok", lid, seed, flush=True)
