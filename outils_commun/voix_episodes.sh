#!/bin/sh
# Génère, choisit et nettoie les voix de plusieurs épisodes à la suite : sh voix_episodes.sh ep1 ep2 ...
cd /home/user/malik-
for e in "$@"; do
  HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e > $e/travail/prises.log 2>&1
  HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e > $e/travail/choix.log 2>&1
  for f in $(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('$e/lignes.json')) if l['who']!='narr'))"); do
    ffmpeg -y -v error -i $e/voix/$f.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 $e/voix/$f.t.mp3 && mv $e/voix/$f.t.mp3 $e/voix/$f.mp3; done
  echo "VOIX $e FIN" >> travail_voix.log
done
