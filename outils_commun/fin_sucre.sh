#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX sucre FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 dentistes" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh sucre EP34_Le_sucre_blanchi "ÉPISODE 34" "LE SUCRE BLANCHI" "« Regarde qui a payé l’étude »" "Le gras… ou le sucre ?"
echo "LIVRE2 sucre" >> travail_voix.log
