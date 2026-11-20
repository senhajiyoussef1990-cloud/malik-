#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX pain FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 lait" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh pain EP19_L_odeur_du_pain_chaud "ÉPISODE 19" "L’ODEUR DU PAIN CHAUD" "« Ton nez fait tes courses »" "Cette bonne odeur… un piège ?"
echo "LIVRE2 pain" >> travail_voix.log
