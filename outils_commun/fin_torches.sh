#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX torches FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 saumon" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh torches EP05_Les_torches_de_la_liberte "ÉPISODE 5" "LES TORCHES DE LA LIBERTÉ" "« On t’a vendu une cigarette »" "Fumer = être libre… vraiment ?"
echo "LIVRE2 torches" >> travail_voix.log
