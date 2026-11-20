#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX cowboy FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 eau" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh cowboy EP14_Le_cow-boy_des_cigarettes "ÉPISODE 14" "LE COW-BOY DES CIGARETTES" "« On t’a vendu un personnage »" "Ce cow-boy… vendait quoi, au juste ?"
echo "LIVRE2 cowboy" >> travail_voix.log
