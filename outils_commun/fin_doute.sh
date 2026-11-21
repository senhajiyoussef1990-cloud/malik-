#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX doute FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 sucre" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh doute EP35_Le_doute_est_leur_produit "ÉPISODE 35" "LE DOUTE EST LEUR PRODUIT" "« Semer le doute »" "On ne sait pas… vraiment ?"
echo "LIVRE2 doute" >> travail_voix.log
