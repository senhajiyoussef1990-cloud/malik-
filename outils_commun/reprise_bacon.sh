#!/bin/sh
# EP11 : refait 4 répliques mal prononcées (graines supplémentaires), puis relance le rendu.
cd /home/user/malik-
IDS="s04a s06a s08b s09b"
HF_HUB_DISABLE_XET=1 GRAINES=1933,1934,1935 /root/venvs/cb/bin/python outils_commun/prises.py bacon $IDS > bacon/travail/reprise.log 2>&1
rm -f bacon/travail/essais/s06a_1931.wav bacon/travail/essais/s06a_1932.wav
HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py bacon $IDS >> bacon/travail/reprise.log 2>&1
echo "REPRISE bacon FIN" >> travail_voix.log
sh outils_commun/fin_bacon.sh
