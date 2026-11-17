"""Essais de voix : /root/venvs/cb/bin/python outils/essai_voix.py <id_réplique> <ref1> <ref2> ...  -> travail/voix_essai/<ref>.wav"""
import json, os, sys, torch, torchaudio
_l = torch.load; torch.load = lambda *a, **k: _l(*a, **{**k, "map_location": "cpu"})
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
txt = next(l["text"] for l in json.load(open(f"{R}/lignes.json")) if l["id"] == sys.argv[1])
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu"); os.makedirs(f"{R}/travail/voix_essai", exist_ok=True)
for ref in sys.argv[2:]:
    torch.manual_seed(1930)
    w = m.generate(txt, language_id="fr", audio_prompt_path=f"{R}/voix/refs/{ref}.wav", exaggeration=0.6, cfg_weight=0.4, temperature=0.75)
    torchaudio.save(f"{R}/travail/voix_essai/{ref}.wav", w, m.sr); print("ok", ref, flush=True)
