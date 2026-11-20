#!/bin/sh
# EP11 : attend la fin des voix, puis rendu HD + montage + story + zip.
cd /home/user/malik-
until grep -q "VOIX bacon FIN" travail_voix.log 2>/dev/null; do sleep 30; done
sh outils_commun/episode.sh bacon EP01_Le_mythe_du_bacon "ÉPISODE 1" "LE MYTHE DU BACON" "« Les médecins recommandent… »" "Le bacon du matin… une pub ?"
echo "LIVRE2 bacon" >> travail_voix.log
