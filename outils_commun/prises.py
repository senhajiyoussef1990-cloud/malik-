"""Phase 1 (venv Chatterbox) : 3 prises par réplique -> <ep>/travail/essais/<id>_<graine>.wav
usage : /root/venvs/cb/bin/python prises.py <dossier_episode> [id ...]"""
import json, os, sys, torch, torchaudio
_l = torch.load; torch.load = lambda *a, **k: _l(*a, **{**k, "map_location": "cpu"})
os.environ.setdefault("HF_HUB_DISABLE_XET", "1"); torch.set_num_threads(os.cpu_count() or 4)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
R = os.path.abspath(sys.argv[1]); only = sys.argv[2:]
JEU = {"narr": ("eleven-jt", .6, .5), "renard": ("eleven-renard", .6, .5), "mouton": ("eleven-mouton", .4, .5),
       "charcutier": ("tv-homme", .5, .5), "producteur": ("tv-homme", .5, .5), "publicitaire": ("tv-homme", .45, .5), "bernays": ("tv-homme", .45, .5), "mere": ("tv-femme", .5, .5), "delegue": ("tv-homme", .5, .5), "cheffe": ("tv-femme", .55, .5), "cliente": ("tv-femme", .5, .5), "figurant": ("tv-homme", .5, .5), "figurante": ("tv-femme", .5, .5), "passant": ("tv-homme", .5, .5)}
m = ChatterboxMultilingualTTS.from_pretrained(device="cpu"); os.makedirs(f"{R}/travail/essais", exist_ok=True)
for L in json.load(open(f"{R}/lignes.json")):
    if only and L["id"] not in only: continue
    ref, ex, cfg = JEU[L["who"]]
    for seed in tuple(int(s) for s in os.environ.get("GRAINES", "1931,1932").split(",")):
        out = f"{R}/travail/essais/{L['id']}_{seed}.wav"
        if os.path.exists(out): continue
        torch.manual_seed(seed)
        w = m.generate(L["text"].replace("’", "'"), language_id="fr", audio_prompt_path=f"{R}/voix/refs/ref-{ref}.wav", exaggeration=ex, cfg_weight=cfg, temperature=.65)
        torchaudio.save(out, w, m.sr); print("ok", L["id"], seed, flush=True)
