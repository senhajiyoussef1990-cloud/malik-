#!/bin/sh
# EP13 : attend ses voix et la fin du rendu du bacon, puis rendu HD + montage + story + zip.
cd /home/user/malik-
until grep -q "VOIX saumon FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 orange" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh saumon EP13_Le_saumon_des_sushis "ÉPISODE 13" "LE SAUMON DES SUSHIS" "« Change l’étiquette… »" "Tes sushis au saumon… une pub ?"
echo "LIVRE2 saumon" >> travail_voix.log
