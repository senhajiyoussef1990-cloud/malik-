#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX rasoir FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 haleine" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh rasoir EP22_Les_poils_de_la_honte "ÉPISODE 22" "LES POILS DE LA HONTE" "« Créer un complexe »" "Ce complexe… qui te l’a vendu ?"
echo "LIVRE2 rasoir" >> travail_voix.log
