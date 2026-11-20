#!/bin/sh
# répliques mal dites sur Kaggle : diamant s02b (renard), s06a ; chanson s05b, s10a (narrateur)
cd /home/user/malik-
r() { e=$1; shift; for i in "$@"; do rm -f $e/travail/essais/${i}_*.wav; done
  HF_HUB_DISABLE_XET=1 GRAINES=1933,1934,1935 /root/venvs/cb/bin/python outils_commun/prises.py $e "$@" >> $e/travail/reprise.log 2>&1
  HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e "$@" >> $e/travail/reprise.log 2>&1; }
r diamant s02b s06a
ffmpeg -y -v error -i diamant/voix/s02b.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 diamant/voix/s02b.t.mp3 && mv diamant/voix/s02b.t.mp3 diamant/voix/s02b.mp3
echo "VOIX diamant FIN" >> travail_voix.log
r chanson s05b s10a
echo "VOIX chanson FIN" >> travail_voix.log
