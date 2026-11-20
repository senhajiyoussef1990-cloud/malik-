#!/bin/sh
# termine les voix du saumon (la file locale s'arrête là : 14 à 17 sur Kaggle, 18-19 sur GitHub)
cd /home/user/malik-
while pgrep -f "choix_prises.py saumon" > /dev/null; do sleep 15; done
for f in $(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('saumon/lignes.json')) if l['who']!='narr'))"); do
  ffmpeg -y -v error -i saumon/voix/$f.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 saumon/voix/$f.t.mp3 && mv saumon/voix/$f.t.mp3 saumon/voix/$f.mp3; done
echo "VOIX saumon FIN" >> travail_voix.log
