#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX overton FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 euphemisme" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh overton EP41_La_fenetre_d_Overton "ÉPISODE 41" "LA FENÊTRE D’OVERTON" "« Un pas à la fois »" "L’impensable devient normal ?"
echo "LIVRE2 overton" >> travail_voix.log
