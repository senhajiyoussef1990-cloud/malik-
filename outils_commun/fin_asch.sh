#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX asch FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 rires" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh asch EP26_Les_lignes_d_Asch "ÉPISODE 26" "LES LIGNES D’ASCH" "« La majorité peut avoir tort »" "Tu dirais comme les autres ?"
echo "LIVRE2 asch" >> travail_voix.log
