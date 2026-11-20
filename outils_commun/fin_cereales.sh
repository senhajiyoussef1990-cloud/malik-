#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX cereales FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 chanson" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh cereales EP10_Le_repas_le_plus_important "ÉPISODE 10" "LE REPAS LE PLUS IMPORTANT" "« Dit le vendeur de céréales »" "Le petit-déjeuner… le plus important ?"
echo "LIVRE2 cereales" >> travail_voix.log
