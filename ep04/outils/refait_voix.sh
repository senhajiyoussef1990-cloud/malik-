#!/bin/sh
# Régénère les voix clonées (références ElevenLabs), puis minutage, bande vidéo, montage et accélération.
cd /home/user/malik-/ep04 || exit 1
LOG=travail/refait.log
HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils/voix.py $(cat travail/a_refaire.txt) > $LOG 2>&1 || exit 1
HF_HUB_DISABLE_XET=1 python3 outils/minutage.py >> $LOG 2>&1 || exit 1
echo "VOIX OK" >> $LOG
