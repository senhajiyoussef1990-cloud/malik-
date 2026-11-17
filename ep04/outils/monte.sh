#!/bin/sh
# Monte l'épisode à partir des plans animés déjà téléchargés (kaggle/clips).
cd /home/user/malik-/ep04/outils || exit 1
python3 bande_clips.py > ../travail/montage_final.log 2>&1 || exit 1
cd /home/user/malik-/ep04 || exit 1
python3 outils/montage.py >> travail/montage_final.log 2>&1
echo "EXIT $?" >> travail/montage_final.log
