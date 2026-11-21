#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX bouc FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 foule" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh bouc EP28_Le_bouc_emissaire "ÉPISODE 28" "LE BOUC ÉMISSAIRE" "« Un seul coupable ? »" "Tout est de sa faute… vraiment ?"
echo "LIVRE2 bouc" >> travail_voix.log
