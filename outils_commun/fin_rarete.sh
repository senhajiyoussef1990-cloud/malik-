#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX rarete FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 abonnement" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh rarete EP22_L_edition_limitee "ÉPISODE 22" "L’ÉDITION LIMITÉE" "« Rare pour qui ? »" "Bientôt épuisé… vraiment ?"
echo "LIVRE2 rarete" >> travail_voix.log
