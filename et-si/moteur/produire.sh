#!/bin/sh
# Produit un épisode cinéma de bout en bout : voix (Kaggle) -> images -> son -> MP4.
# usage : sh et-si/moteur/produire.sh et-si/survie/cine/EP003 SORTIE [JOBS]
set -e
P=$1; O=$2; J=${3:-4}
python3 et-si/moteur/kaggle_voix.py --kit $P/kit.json --cues $P/cues.json --out $O -- --voice fr-FR-RemyMultilingualNeural --rate=+8% --first 3.6 --mini 2.8 --last 5.5 --tail 0.2 --end-tail 2.2 --maxchars 34 --tagline-shown
python3 et-si/moteur/render.py --anim $P/anim.html --out $O --jobs $J
if [ -f $P/audio.py ]; then python3 $P/audio.py --out $O; else python3 et-si/survie/cine/audio.py --out $O --sons $P/sons.json; fi
python3 et-si/moteur/assembler.py --out $O --music -28 --duck
