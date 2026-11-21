#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX serrure FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 couveuses" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh serrure EP38_Les_images_dans_nos_tetes "ÉPISODE 38" "LES IMAGES DANS NOS TÊTES" "« Le monde par le trou de la serrure »" "Ce que tu sais du monde… vient d’où ?"
echo "LIVRE2 serrure" >> travail_voix.log
