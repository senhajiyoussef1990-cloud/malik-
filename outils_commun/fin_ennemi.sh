#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX ennemi FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 bouc" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh ennemi EP29_L_ennemi_commun "ÉPISODE 29" "L’ENNEMI COMMUN" "« Unir par la peur »" "Ce loup… il existe ?"
echo "LIVRE2 ennemi" >> travail_voix.log
