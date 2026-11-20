#!/bin/sh
# EP12 : attend ses voix et la fin du rendu du bacon, puis rendu HD + montage + story + zip.
cd /home/user/malik-
until grep -q "VOIX orange FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 bacon" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh orange EP12_Le_jus_d_orange_du_matin "ÉPISODE 12" "LE JUS D’ORANGE DU MATIN" "« Buvez une orange ! »" "Ton jus du matin… une pub ?"
echo "LIVRE2 orange" >> travail_voix.log
