#!/bin/sh
cd /home/user/malik-
IDS="s04a s06a s10b"
for i in $IDS; do rm -f saumon/travail/essais/${i}_*.wav; done
HF_HUB_DISABLE_XET=1 GRAINES=1933,1934,1935 /root/venvs/cb/bin/python outils_commun/prises.py saumon $IDS > saumon/travail/reprise.log 2>&1
HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py saumon $IDS >> saumon/travail/reprise.log 2>&1
for f in s10b; do   # seule réplique refaite d'un personnage (les autres ont déjà été accélérées)
  ffmpeg -y -v error -i saumon/voix/$f.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 saumon/voix/$f.t.mp3 && mv saumon/voix/$f.t.mp3 saumon/voix/$f.mp3; done
echo "VOIX saumon FIN" >> travail_voix.log
