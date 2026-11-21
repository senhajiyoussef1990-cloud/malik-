#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX blouse FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 avis" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh blouse EP32_La_blouse_qui_vend "ÉPISODE 32" "LA BLOUSE QUI VEND" "« Une blouse n’est pas une preuve »" "Le médecin de la pub… vrai ?"
echo "LIVRE2 blouse" >> travail_voix.log
