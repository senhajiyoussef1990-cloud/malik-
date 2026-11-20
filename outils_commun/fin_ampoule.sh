#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX ampoule FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 chanson" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh ampoule EP18_L_ampoule_programmee "ÉPISODE 18" "L’AMPOULE PROGRAMMÉE" "« Mille heures, pas une de plus »" "Ton ampoule… grillée exprès ?"
echo "LIVRE2 ampoule" >> travail_voix.log
