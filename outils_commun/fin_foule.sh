#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX foule FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 asch" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh foule EP27_L_ame_des_foules "ÉPISODE 27" "L’ÂME DES FOULES" "« Garde ta tête »" "Dans la foule, qui pense ?"
echo "LIVRE2 foule" >> travail_voix.log
