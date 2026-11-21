#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX avis FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 astroturf" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh avis EP31_Les_faux_avis "ÉPISODE 31" "LES FAUX AVIS" "« Cinq étoiles, écrites par qui ? »" "Ces avis… qui les a écrits ?"
echo "LIVRE2 avis" >> travail_voix.log
