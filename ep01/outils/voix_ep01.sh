#!/bin/sh
cd /home/user/malik-/ep01 || exit 1
HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils/voix.py > travail/voix.log 2>&1 && HF_HUB_DISABLE_XET=1 python3 outils/minutage.py >> travail/voix.log 2>&1
echo "FIN $?" >> travail/voix.log
