"""Génère les répliques de Maurice avec la voix clonée (Chatterbox multilingue, licence MIT).

Usage : /root/venvs/cb/bin/python tools/clone.py clips.json
clips.json = [{"text": "...", "out": "chemin.wav"}, ...]
Référence : voices/ref-maurice.wav (extrait de la voix créée par l'utilisateur dans ElevenLabs).
"""
import json, os, sys, time
import torch, torchaudio

# Les poids sont publiés pour GPU : on force le chargement sur CPU.
_load = torch.load
torch.load = lambda *a, **k: _load(*a, **{**k, "map_location": "cpu"})
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")

from chatterbox.mtl_tts import ChatterboxMultilingualTTS

root = os.path.join(os.path.dirname(__file__), "..")
ref = os.path.join(root, "voices", "ref-maurice.wav")
clips = json.load(open(sys.argv[1]))
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
for c in clips:
    t0 = time.time()
    torch.manual_seed(c.get("seed", 1930))
    text = c["text"].replace("|", " ")
    wav = model.generate(text, language_id="fr", audio_prompt_path=ref,
                         exaggeration=c.get("exaggeration", 0.65), cfg_weight=c.get("cfg", 0.45),
                         temperature=0.7)
    torchaudio.save(c["out"], wav, model.sr)
    print(f"{time.time() - t0:5.1f}s  {text}", flush=True)
