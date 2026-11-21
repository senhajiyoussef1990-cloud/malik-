#!/bin/sh
# Si Kaggle n'a pas démarré au bout de 5 min : voix des EP22-36 sur ce serveur (CPU), un épisode après l'autre.
cd /home/user/malik-; K=fabrique-voix-22-41
sleep 300
st() { python3 outils_commun/kaggle/kg.py status $K | python3 -c "import json,sys;print(json.load(sys.stdin).get('status'))"; }
[ "$(st)" != "queued" ] && { echo "$(date +%H:%M) Kaggle a démarré ($(st)) : pas de voix locales"; exit 0; }
echo "$(date +%H:%M) Kaggle toujours en attente : voix locales"; pkill -f "recup_voix.sh $K"
EPS="rarete file claque rires asch foule bouc ennemi astroturf avis blouse dentistes sucre doute milgram"; reste="$EPS"
for e in $EPS; do
  s=$(st); if [ "$s" = "running" ] || [ "$s" = "complete" ]; then echo "$(date +%H:%M) Kaggle $s : il prend la suite ($reste)"; sh outils_commun/kaggle/recup_voix.sh $K $reste >> travail_kaggle12.log 2>&1; exit 0; fi
  reste=$(echo $reste | sed "s/^$e *//")
  ids=$(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('$e/lignes.json')) if l['id']!='s16a'))")
  echo "$(date +%H:%M) voix $e"
  HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e $ids > $e/travail/prises.log 2>&1
  HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e > $e/travail/choix.log 2>&1
  cp outils_commun/phrase_finale.mp3 $e/voix/s16a.mp3
  for f in $(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('$e/lignes.json')) if l['who']!='narr'))"); do
    ffmpeg -y -v error -i $e/voix/$f.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 $e/voix/$f.t.mp3 && mv $e/voix/$f.t.mp3 $e/voix/$f.mp3; done
  awk '$2<0.86' $e/travail/choix.log | head -8
  echo "VOIX $e FIN" >> travail_voix.log
done
