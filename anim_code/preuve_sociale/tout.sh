#!/bin/sh
# Rend les 17 scènes (4 en parallèle), assemble la bande et lance le montage de « La preuve sociale ».
EP=preuve_sociale; A=/home/user/malik-/anim_code; E=/home/user/malik-/$EP; LOG=$A/travail/${EP}_rendu.log
cd $A || exit 1
ls $EP/scene*.js | sed "s/.*scene\([0-9]*\).js/\1/" | grep -E "${SCENES:-.}" | xargs -P 4 -I{} node rendu_scene.js $EP {} > $LOG 2>&1
python3 - <<'PY'
import json, subprocess, glob
A="/home/user/malik-/anim_code"; E="/home/user/malik-/preuve_sociale"; N="PREUVE_SOCIALE"; plans=[]; t=0.0
n_max=len(glob.glob(f"{A}/preuve_sociale/scene*.js"))
with open(f"{A}/travail/{N}_liste.txt","w") as f:
    for n in range(1,n_max+1):
        j=json.load(open(f"{A}/travail/{N}_scene{n:02d}.json"))
        plans.append({"n":n,"t0":t,"dur":j["dur"],"lignes":j["lignes"]}); t+=j["dur"]
        f.write(f"file '{A}/travail/{N}_scene{n:02d}_muet.mp4'\n")
json.dump(plans,open(f"{E}/travail/plans.json","w"),indent=1)
subprocess.run(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",f"{A}/travail/{N}_liste.txt","-c","copy",f"{E}/travail/bande.mp4"],check=True)
print("bande", round(t,1), "s")
PY
cd $E && python3 outils/montage.py >> $LOG 2>&1
echo "FIN $?" >> $LOG
