#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX diamant FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 saumon" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh diamant EP14_Le_diamant_eternel "ÉPISODE 14" "LE DIAMANT ÉTERNEL" "« Deux mois de salaire »" "Ta bague en diamant… une pub ?"
echo "LIVRE2 diamant" >> travail_voix.log
