#!/bin/sh
# Attend les voix EP42-50 (Kaggle papisrieux, sondage lent pour éviter le 429), les range, puis rend un par un.
cd /home/user/malik-; K=fabrique-voix-42-50; EPS="risque survivant halo recyclage carbone vidange modele ciblage horoscope"; O=/tmp/claude-0/kaggle_$K
while :; do S=$(python3 outils_commun/kaggle/kg.py status $K | python3 -c "import json,sys;print(json.load(sys.stdin).get('status',''))" 2>/dev/null); echo "$(date +%H:%M) $S"; case "$S" in complete|error|cancel*) break;; esac; sleep 300; done
mkdir -p $O && python3 outils_commun/kaggle/kg.py output $K $O
for e in $EPS; do [ -f $O/voix_$e.zip ] && unzip -o -q $O/voix_$e.zip -d .; cp outils_commun/phrase_finale.mp3 $e/voix/s16a.mp3; cp abonnement/voix/s14a.mp3 $e/voix/s14a.mp3; echo "$e : $(ls $e/voix/*.mp3 | wc -l) voix"; done
echo "VOIX 42-50 PRETES" >> travail_voix.log
until [ -f /tmp/claude-0/go_rendus_42_50 ]; do sleep 60; done
for e in $EPS; do S=$e/specification.json; j() { python3 -c "import json;print(json.load(open('$S'))['$1'])"; }
  echo "$(date +%H:%M) rendu $e ($(df -h . | tail -1 | awk '{print $4}') libres)"; sh outils_commun/episode.sh $e "$(j nom)" "$(j badge)" "$(j titre)" "$(j sous)" "$(j accroche)"
  ls $e/sortie/*.zip > /dev/null 2>&1 && echo "LIVRE3 $e" >> travail_voix.log; echo "$(date +%H:%M) fini $e"; done
