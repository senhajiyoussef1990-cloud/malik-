#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX couveuses FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 milgram" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh couveuses EP37_Les_couveuses "ÉPISODE 37" "LES COUVEUSES" "« Une émotion n’est pas une preuve »" "Cette larme… était-elle vraie ?"
echo "LIVRE2 couveuses" >> travail_voix.log
