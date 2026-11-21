#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX chaine FIN" travail_voix.log 2>/dev/null; do sleep 30; done
sh outils_commun/episode.sh chaine Bienvenue_sur_la_chaine "LA CHAÎNE" "NE SUIS PAS LES MOUTONS" "« Bienvenue sur la chaîne »" "C’est quoi, cette chaîne ?"
echo "LIVRE2 chaine" >> travail_voix.log
