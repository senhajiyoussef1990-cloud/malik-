#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX filtres FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 serrure" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh filtres EP39_Les_cinq_filtres "ÉPISODE 39" "LES CINQ FILTRES" "« Demande-toi qui paie le journal »" "Ton info… est passée par où ?"
echo "LIVRE2 filtres" >> travail_voix.log
