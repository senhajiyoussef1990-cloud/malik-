#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX echantillon FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 pain" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh echantillon EP30_Le_cadeau_qui_oblige "ÉPISODE 30" "LE CADEAU QUI OBLIGE" "« La réciprocité »" "Un cadeau gratuit… vraiment gratuit ?"
echo "LIVRE2 echantillon" >> travail_voix.log
