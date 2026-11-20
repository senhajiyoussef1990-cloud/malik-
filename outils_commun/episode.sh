#!/bin/sh
# Chaîne complète d'un épisode dont les voix sont prêtes : minutage, rendu des scènes, assemblage, montage, image story, zip.
# usage : sh episode.sh <dossier> <NOM_SORTIE> <badge> <titre> <sous-titre> <accroche>
EP=$1; NOM=$2; A=/home/user/malik-/anim_code; E=/home/user/malik-/$EP; N=$(echo $EP | tr a-z A-Z); LOG=$A/travail/${EP}_rendu.log
cd $E && HF_HUB_DISABLE_XET=1 python3 outils/minutage.py > travail/minutage.log 2>&1 || exit 1
cd $A && export STYLE=1 && ls $EP/scene*.js | sed "s/.*scene\([0-9]*\).js/\1/" | grep -E "${SCENES:-.}" | xargs -P 3 -I{} node rendu_scene.js $EP {} > $LOG 2>&1
python3 - "$EP" "$N" <<'PY'
import json, subprocess, glob, sys
EP, N = sys.argv[1:3]; A="/home/user/malik-/anim_code"; E=f"/home/user/malik-/{EP}"; plans=[]; t=0.0
nm=len(glob.glob(f"{A}/{EP}/scene*.js"))
with open(f"{A}/travail/{N}_liste.txt","w") as f:
    for n in range(1,nm+1):
        j=json.load(open(f"{A}/travail/{N}_scene{n:02d}.json")); plans.append({"n":n,"t0":t,"dur":j["dur"],"lignes":j["lignes"]}); t+=j["dur"]
        f.write(f"file '{A}/travail/{N}_scene{n:02d}_muet.mp4'\n")
json.dump(plans,open(f"{E}/travail/plans.json","w"),indent=1)
subprocess.run(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",f"{A}/travail/{N}_liste.txt","-c","copy",f"{E}/travail/bande.mp4"],check=True)
print("bande", round(t,1), "s")
PY
cd $E && python3 outils/montage.py >> $LOG 2>&1 || exit 2
python3 /home/user/malik-/outils_commun/story.py sortie/${NOM}_sans_sous_titres.mp4 5 "$3" "$4" "$5" "$6" sortie/${NOM}_story.png fonts >> $LOG 2>&1
cd sortie && rm -f $NOM.zip && zip -q -0 $NOM.zip $NOM.mp4 ${NOM}_publications.txt ${NOM}_story.png ${NOM}_couverture.png
echo "FIN $EP" >> $LOG
