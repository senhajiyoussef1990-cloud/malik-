#!/bin/sh
# Rend les 15 scènes (4 en parallèle), assemble la bande et lance le montage de l'épisode 1.
cd /home/user/malik-/anim_code || exit 1
ls ep01/scene*.js | sed "s/.*scene\([0-9]*\).js/\1/" | grep -E "${SCENES:-.}" | xargs -P 4 -I{} node rendu_scene.js ep01 {} > travail/ep01_rendu.log 2>&1
python3 - <<'PY'
import json, subprocess, os
A="/home/user/malik-/anim_code"; E="/home/user/malik-/ep01"; plans=[]; t=0.0
with open(f"{A}/travail/ep01_liste.txt","w") as f:
    for n in range(1,16):
        j=json.load(open(f"{A}/travail/EP01_scene{n:02d}.json"))
        plans.append({"n":n,"t0":t,"dur":j["dur"],"lignes":j["lignes"]}); t+=j["dur"]
        f.write(f"file '{A}/travail/EP01_scene{n:02d}_muet.mp4'\n")
json.dump(plans,open(f"{E}/travail/plans.json","w"),indent=1)
subprocess.run(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",f"{A}/travail/ep01_liste.txt","-c","copy",f"{E}/travail/bande.mp4"],check=True)
print("bande", round(t,1), "s")
PY
cd /home/user/malik-/ep01 && python3 outils/montage.py >> /home/user/malik-/anim_code/travail/ep01_rendu.log 2>&1
echo "FIN $?" >> /home/user/malik-/anim_code/travail/ep01_rendu.log
