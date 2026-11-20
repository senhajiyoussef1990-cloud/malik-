#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX martiens FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 ampoule" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh martiens EP19_La_guerre_des_mondes "ÉPISODE 19" "LA GUERRE DES MONDES" "« Ça ressemble aux infos… »" "La grande panique de 1938… vraiment ?"
echo "LIVRE2 martiens" >> travail_voix.log
