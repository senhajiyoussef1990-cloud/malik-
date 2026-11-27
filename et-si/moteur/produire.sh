#!/bin/sh
# Produit un épisode cinéma de bout en bout : voix (Kaggle) -> images -> son -> MP4.
# usage : sh et-si/moteur/produire.sh et-si/survie/cine/EP003 SORTIE [JOBS]
set -e
P=$1; O=$2; J=${3:-4}
# la voix doit toujours être Remy : on relance tant que Kaggle a dû prendre une voix de secours
for essai in 1 2 3 4 5; do
  python3 et-si/moteur/kaggle_voix.py --kit $P/kit.json --cues $P/cues.json --out $O -- --voice fr-FR-RemyMultilingualNeural --rate=+8% --first 3.6 --mini 2.8 --last 5.5 --tail 0.2 --end-tail 2.2 --maxchars 34 --tagline-shown
  if python3 -c "import json,sys;sys.exit(0 if json.load(open('$O/timing.json'))['voice']==['fr-FR-RemyMultilingualNeural'] else 1)"; then break; fi
  echo "voix de secours utilisée, nouvel essai ($essai)"; sleep 30
  [ $essai = 5 ] && { echo "Remy indisponible"; exit 1; }
done
python3 et-si/moteur/render.py --anim $P/anim.html --out $O --jobs $J
if [ -f $P/audio.py ]; then python3 $P/audio.py --out $O; else python3 et-si/survie/cine/audio.py --out $O --sons $P/sons.json; fi
python3 et-si/moteur/assembler.py --out $O --music -28 --duck
