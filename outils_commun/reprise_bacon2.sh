#!/bin/sh
cd /home/user/malik-
HF_HUB_DISABLE_XET=1 GRAINES=1931,1932,1933 /root/venvs/cb/bin/python outils_commun/prises.py bacon s04a s08b > bacon/travail/reprise2.log 2>&1
HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py bacon s04a s08b >> bacon/travail/reprise2.log 2>&1
echo "REPRISE2 bacon FIN" >> travail_voix.log
sh outils_commun/fin_bacon.sh
