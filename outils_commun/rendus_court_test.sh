#!/bin/sh
cd /home/user/malik-
for e in frais tulipes pastille; do until grep -q "VOIXCOURT $e" travail_voix.log; do sleep 30; done
  S=$e/specification.json; j() { python3 -c "import json;print(json.load(open('$S'))['$1'])"; }
  echo "$(date +%H:%M) rendu $e"; sh outils_commun/episode.sh $e "$(j nom)" "$(j badge)" "$(j titre)" "$(j sous)" "$(j accroche)"
  ls $e/sortie/*.zip > /dev/null 2>&1 && echo "LIVRECOURT $e" >> travail_voix.log; echo "$(date +%H:%M) fini $e"; done
