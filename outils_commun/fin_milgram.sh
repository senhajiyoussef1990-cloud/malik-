#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX milgram FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 doute" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh milgram EP36_L_obeissance "ÉPISODE 36" "L’OBÉISSANCE" "« Obéir, ce n’est pas penser »" "Jusqu’où obéirais-tu ?"
echo "LIVRE2 milgram" >> travail_voix.log
