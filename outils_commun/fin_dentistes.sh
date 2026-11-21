#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX dentistes FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 blouse" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh dentistes EP33_Quatre_dentistes_sur_cinq "ÉPISODE 33" "QUATRE DENTISTES SUR CINQ" "« Sur combien, et qui a payé ? »" "Quatre sur cinq… de quoi ?"
echo "LIVRE2 dentistes" >> travail_voix.log
