#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX euphemisme FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 filtres" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh euphemisme EP40_Le_mot_qui_change_tout "ÉPISODE 40" "LE MOT QUI CHANGE TOUT" "« Change le mot, la chose paraît douce »" "Un mot doux… pour quoi ?"
echo "LIVRE2 euphemisme" >> travail_voix.log
