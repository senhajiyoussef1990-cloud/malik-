#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX leurre FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 prixbarre" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh leurre EP27_L_option_du_milieu "ÉPISODE 27" "L’OPTION DU MILIEU" "« Le leurre »" "Pourquoi tu choisis toujours le moyen ?"
echo "LIVRE2 leurre" >> travail_voix.log
