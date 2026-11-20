#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX neufneuf FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 cowboy" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh neufneuf EP15_Le_prix_en_99 "ÉPISODE 15" "LE PRIX EN 99" "« Un centime pour ton œil »" "9,99… ce n’est pas 10 ?"
echo "LIVRE2 neufneuf" >> travail_voix.log
