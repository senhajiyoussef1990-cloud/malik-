"""Phase 1 (venv Chatterbox) : 3 prises par réplique -> <ep>/travail/essais/<id>_<graine>.wav
usage : /root/venvs/cb/bin/python prises.py <dossier_episode> [id ...]"""
import json, os, sys, torch, torchaudio
_l = torch.load; torch.load = lambda *a, **k: _l(*a, **{**k, "map_location": "cpu"})
os.environ.setdefault("HF_HUB_DISABLE_XET", "1"); torch.set_num_threads(os.cpu_count() or 4)
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
R = os.path.abspath(sys.argv[1]); only = sys.argv[2:]
JEU = {"narr": ("eleven-jt", .6, .5), "aubergiste": ("tv-homme", 0.5, .5), "auditeur": ("tv-homme", 0.5, .5), "avocat": ("tv-homme", 0.5, .5), "berger": ("tv-homme", 0.5, .5), "chapelier": ("tv-homme", 0.5, .5), "chef": ("tv-homme", 0.5, .5), "chercheur": ("tv-homme", 0.5, .5), "collecteur": ("tv-homme", 0.5, .5), "communicant": ("tv-homme", 0.5, .5), "confiseur": ("tv-homme", 0.5, .5), "dentiste": ("tv-homme", 0.5, .5), "etudiant": ("tv-homme", 0.5, .5), "habitante": ("tv-femme", 0.5, .5), "ingenieur": ("tv-homme", 0.5, .5), "journaliste": ("tv-homme", 0.5, .5), "maire": ("tv-homme", 0.5, .5), "medecin": ("tv-homme", 0.5, .5), "orateur": ("tv-homme", 0.5, .5), "participant": ("tv-homme", 0.5, .5), "patron": ("tv-homme", 0.5, .5), "redacteur": ("tv-homme", 0.5, .5), "savant": ("tv-homme", 0.5, .5), "spectatrice": ("tv-femme", 0.5, .5), "temoin": ("tv-femme", 0.6, .5), "villageois": ("tv-homme", 0.5, .5), "villageoise": ("tv-femme", 0.5, .5), "voisin": ("tv-homme", 0.5, .5), "renard": ("eleven-renard", .6, .5), "mouton": ("eleven-mouton", .4, .5),
       "charcutier": ("tv-homme", .5, .5), "producteur": ("tv-homme", .5, .5), "publicitaire": ("tv-homme", .45, .5), "bernays": ("tv-homme", .45, .5), "mere": ("tv-femme", .5, .5), "diamantaire": ("tv-homme", .5, .5), "vedette": ("tv-femme", .6, .5), "redactrice": ("tv-femme", .5, .5), "fiance": ("tv-homme", .45, .5), "delegue": ("tv-homme", .5, .5), "cheffe": ("tv-femme", .55, .5), "cliente": ("tv-femme", .5, .5), "fabricant": ("tv-homme", .5, .5), "passante": ("tv-femme", .5, .5), "biscuitier": ("tv-homme", .5, .5), "animateur": ("tv-homme", .65, .5), "auditrice": ("tv-femme", .55, .5), "industriel": ("tv-homme", .5, .5), "speaker": ("tv-homme", .6, .5), "crieur": ("tv-homme", .65, .5), "docteur": ("tv-homme", .5, .5), "vendeur": ("tv-homme", .55, .5), "mariee": ("tv-femme", .55, .5), "fumeur": ("tv-homme", .5, .5), "epicier": ("tv-homme", .5, .5), "marchand": ("tv-homme", .55, .5), "client": ("tv-homme", .5, .5), "lecteur": ("tv-homme", .5, .5), "inventeur": ("tv-homme", .55, .5), "boulanger": ("tv-homme", .5, .5), "moine": ("tv-homme", .45, .5), "voyageur": ("tv-homme", .5, .5), "figurant": ("tv-homme", .5, .5), "figurante": ("tv-femme", .5, .5), "passant": ("tv-homme", .5, .5)}

# Mots anglais (ou étrangers) prononcés « à l'anglaise » : la voix française lit l'orthographe phonétique, les sous-titres gardent le vrai mot.
import re as _re
ANGLAIS = {"bacon": "békeune", "bacons": "békeunes", "hamburger": "ambeurgueur", "hamburgers": "ambeurgueurs", "cheeseburger": "tchizbeurgueur",
           "ketchup": "kètcheupe", "milkshake": "milkchéque", "juke-box": "djoukboxe", "jukebox": "djoukboxe", "payola": "péyola",
           "Bernays": "Bernaisse", "Edward": "Èdouard", "Daily": "Déïli", "News": "Niouze", "Times": "Taïmz", "Herald": "Hèrald",
           "show": "chô", "Asch": "Ache", "Milgram": "Milgrame", "Stanley": "Stanlé", "Solomon": "Solomone", "Lippmann": "Lipmane", "Walter": "Ouolteur", "Chomsky": "Chomski", "Noam": "Noème", "Herman": "Hèrmane", "Edward": "Èdouard", "Overton": "Ovèrteune", "Joseph": "Djozèf", "astroturfing": "astrotteurfingue", "baskets": "baskètte", "cow-boy": "kaoboï", "cow-boys": "kaoboïs", "cowboy": "kaoboï", "fast-food": "fastefoude", "marketing": "markètingue", "manager": "manadjeur", "people": "pipeule",
           "smartphone": "smartefone", "best-seller": "bèstesèleur", "cow-boy": "kaoboï", "cow-boys": "kaoboïs", "merchandising": "meurchandaïzingue", "pop-corn": "popcorne", "Sunshine": "Seunchaïne", "General": "Djénéral", "Motors": "Motorz", "Bertram": "Bèrtrame", "Forer": "Foreur", "Shoshana": "Chochana", "Zuboff": "Zouboff", "California": "Kalifornia"}
def a_l_anglaise(txt):
    return _re.sub(r"[A-Za-zÀ-ÿ-]+", lambda m: ANGLAIS.get(m.group(0), ANGLAIS.get(m.group(0).lower(), m.group(0))), txt)
m = ChatterboxMultilingualTTS.from_pretrained(device=os.environ.get("DEVICE") or ("cuda" if torch.cuda.is_available() else "cpu")); os.makedirs(f"{R}/travail/essais", exist_ok=True)
for L in json.load(open(f"{R}/lignes.json")):
    if only and L["id"] not in only: continue
    ref, ex, cfg = JEU[L["who"]]
    for seed in tuple(int(s) for s in os.environ.get("GRAINES", "1931,1932").split(",")):
        out = f"{R}/travail/essais/{L['id']}_{seed}.wav"
        if os.path.exists(out): continue
        torch.manual_seed(seed)
        w = m.generate(a_l_anglaise(L.get("dit", L["text"])).replace("’", "'"), language_id="fr", audio_prompt_path=f"{R}/voix/refs/ref-{ref}.wav", exaggeration=ex, cfg_weight=cfg, temperature=.65)
        torchaudio.save(out, w, m.sr); print("ok", L["id"], seed, flush=True)
