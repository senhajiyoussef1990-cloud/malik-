#!/bin/sh
cd /home/user/malik-
for e in ${EPS:-blouse dentistes sucre doute milgram}; do S=$e/specification.json; j() { python3 -c "import json;print(json.load(open('$S'))['$1'])"; }
  echo "$(date +%H:%M) rendu $e ($(df -h . | tail -1 | awk '{print $4}') libres)"; sh outils_commun/episode.sh $e "$(j nom)" "$(j badge)" "$(j titre)" "$(j sous)" "$(j accroche)"
  ls $e/sortie/*.zip > /dev/null 2>&1 && echo "LIVRE3 $e" >> travail_voix.log; echo "$(date +%H:%M) fini $e"; done
