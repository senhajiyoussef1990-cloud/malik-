#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX rires FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 claque" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh rires EP25_Les_rires_enregistres "ÉPISODE 25" "LES RIRES ENREGISTRÉS" "« Ris si c’est drôle »" "Tu ris… ou la boîte rit ?"
echo "LIVRE2 rires" >> travail_voix.log
