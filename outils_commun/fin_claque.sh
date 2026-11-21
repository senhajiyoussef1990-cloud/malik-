#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX claque FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 file" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh claque EP24_La_claque "ÉPISODE 24" "LA CLAQUE" "« Des bravos payés »" "Qui a applaudi en premier ?"
echo "LIVRE2 claque" >> travail_voix.log
