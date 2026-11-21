#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX file FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 rarete" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh file EP23_La_file_d_attente "ÉPISODE 23" "LA FILE D’ATTENTE" "« Une file peut être un décor »" "Cette file… elle est vraie ?"
echo "LIVRE2 file" >> travail_voix.log
