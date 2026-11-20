#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX eau FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 rasoir" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh eau EP13_L_eau_en_bouteille "ÉPISODE 13" "L’EAU EN BOUTEILLE" "« Vendre ce qui est gratuit »" "Payer l’eau… plus cher que l’essence ?"
echo "LIVRE2 eau" >> travail_voix.log
