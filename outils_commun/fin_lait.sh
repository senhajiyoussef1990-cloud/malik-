#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX lait FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 leurre" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh lait EP28_Le_lait_au_fond_du_magasin "ÉPISODE 28" "LE LAIT AU FOND DU MAGASIN" "« Le chemin le plus long »" "Pourquoi le lait est toujours au fond ?"
echo "LIVRE2 lait" >> travail_voix.log
