#!/bin/sh
cd /home/user/malik-
until grep -q "REFAIT2 pastille" travail_voix.log; do sleep 30; done
for e in tulipes frais; do S=$e/specification.json; j() { python3 -c "import json;print(json.load(open('$S'))['$1'])"; }
  sh outils_commun/episode.sh $e "$(j nom)" "$(j badge)" "$(j titre)" "$(j sous)" "$(j accroche)"; echo "REFAIT2 $e" >> travail_voix.log; done
