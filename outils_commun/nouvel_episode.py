"""Crée un épisode à partir d'un fichier de répliques : dossiers, lignes.json, voix provisoires, montage, file d'attente voix + rendu.
usage : python3 outils_commun/nouvel_episode.py <spec.json>
spec : {"ep": "torches", "nom": "EP15_...", "badge": "ÉPISODE 15", "titre": "...", "sous": "« ... »", "accroche": "...",
        "apres": "diamant", "noms": {"fabricant": "FABRICANT"}, "lignes": [[id, scene, who, pause, texte], ...]}"""
import json, os, sys, shutil, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); S = json.load(open(sys.argv[1])); ep = S["ep"]; E = f"{R}/{ep}"
for d in ["voix", "travail/voix_temp", "sortie", "outils"]: os.makedirs(f"{E}/{d}", exist_ok=True)
os.makedirs(f"{R}/anim_code/{ep}", exist_ok=True)
if not os.path.exists(f"{E}/voix/refs"): shutil.copytree(f"{R}/bacon/voix/refs", f"{E}/voix/refs")
for d in ["fonts", "audio"]:
    if not os.path.exists(f"{E}/{d}"): shutil.copytree(f"{R}/bacon/{d}", f"{E}/{d}")
shutil.copy(f"{R}/bacon/outils/minutage.py", f"{E}/outils/")
m = open(f"{R}/bacon/outils/montage.py").read()
m = m.replace('"LE MYTHE DU BACON", "« Les médecins recommandent… »"', json.dumps(S["titre"], ensure_ascii=False) + ", " + json.dumps(S["sous"], ensure_ascii=False))
m = m.replace("EP11_Le_mythe_du_bacon", S["nom"]).replace("Épisode LE MYTHE DU BACON", "Épisode " + S["titre"])
m = m.replace('"charcutier": "CHARCUTIER", "bernays": "BERNAYS", "mere": "MÈRE DE FAMILLE"', ", ".join(f'"{k}": "{v}"' for k, v in S["noms"].items()))
open(f"{E}/outils/montage.py", "w").write(m)
L = [{"id": i, "plan": k + 1, "scene": s, "who": w, "pause": p, "text": t} for k, (i, s, w, p, t, *_) in enumerate(S["lignes"])]
for l, x in zip(L, S["lignes"]):
    if len(x) > 5: l["dit"] = x[5]
json.dump(L, open(f"{E}/lignes.json", "w"), ensure_ascii=False, indent=1)
for l in L: subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", f"sine=f=180:d={max(1.2, len(l['text']) * .062):.2f}", "-af", "volume=0.3", f"{E}/travail/voix_temp/{l['id']}.mp3"], check=True)
fin = f"""#!/bin/sh
cd {R}
until grep -q "VOIX {ep} FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 {S['apres']}" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh {ep} {S['nom']} "{S['badge']}" "{S['titre']}" "{S['sous']}" "{S['accroche']}"
echo "LIVRE2 {ep}" >> travail_voix.log
"""
open(f"{R}/outils_commun/fin_{ep}.sh", "w").write(fin)
gi = open(f"{R}/.gitignore").read()
if f"{ep}/travail/" not in gi: open(f"{R}/.gitignore", "a").write(f"{ep}/travail/\n")
print("ok", ep, len(L), "répliques")
