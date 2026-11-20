#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX haleine FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 cereales" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh haleine EP21_La_mauvaise_haleine "ÉPISODE 21" "LA MAUVAISE HALEINE" "« Inventer le problème »" "Ta mauvaise haleine… une invention ?"
echo "LIVRE2 haleine" >> travail_voix.log
