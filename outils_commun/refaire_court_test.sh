#!/bin/sh
# Format court sans hook : nouvelles répliques d'ouverture (mouton puis renard), puis rendu des 3 tests.
cd /home/user/malik-
for e in frais tulipes pastille; do
  GRAINES=1931,1932,1933 HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e s02a s02b >> $e/travail/prises.log 2>&1
  HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e s02a s02b > $e/travail/choix_ouverture.log 2>&1
  for f in s02a s02b; do ffmpeg -y -v error -i $e/voix/$f.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 $e/voix/$f.t.mp3 && mv $e/voix/$f.t.mp3 $e/voix/$f.mp3; done
  grep -E "^s02" $e/travail/choix_ouverture.log
done
for e in frais tulipes pastille; do S=$e/specification.json; j() { python3 -c "import json;print(json.load(open('$S'))['$1'])"; }
  rm -f anim_code/travail/$(echo $e | tr a-z A-Z)_scene*
  echo "$(date +%H:%M) rendu $e"; sh outils_commun/episode.sh $e "$(j nom)" "$(j badge)" "$(j titre)" "$(j sous)" "$(j accroche)"; echo "$(date +%H:%M) fini $e"; done
