#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX chanson FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 reduflation" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh chanson EP07_La_chanson_qu_on_finit_par_aimer "ÉPISODE 7" "LA CHANSON QU’ON FINIT PAR AIMER" "« Encore et encore »" "Tu l’aimes… ou tu l’entends trop ?"
echo "LIVRE2 chanson" >> travail_voix.log
