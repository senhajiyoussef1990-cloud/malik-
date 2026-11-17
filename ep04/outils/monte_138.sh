#!/bin/sh
# Monte puis accélère l épisode pour atteindre la durée cible.
sh /home/user/malik-/ep04/outils/monte.sh
cd /home/user/malik-/ep04 || exit 1
python3 outils/accelere.py 138 >> travail/montage_final.log 2>&1
echo "FIN $?" >> travail/montage_final.log
