#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX astroturf FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 ennemi" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh astroturf EP30_Le_faux_mouvement "ÉPISODE 30" "LE FAUX MOUVEMENT" "« Des voisins tous payés »" "Spontané… ou financé ?"
echo "LIVRE2 astroturf" >> travail_voix.log
