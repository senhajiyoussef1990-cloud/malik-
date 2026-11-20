#!/bin/sh
# attend la fin du carnet Kaggle, récupère les voix, les range dans chaque épisode et débloque leur rendu local
cd /home/user/malik-; K=$1; shift
while :; do S=$(python3 outils_commun/kaggle/kg.py status $K | python3 -c "import json,sys;print(json.load(sys.stdin).get('status',''))"); echo "$(date +%T) $S"; case "$S" in complete|error|cancel*) break;; esac; sleep 120; done
mkdir -p /tmp/claude-0/kaggle_$K && python3 outils_commun/kaggle/kg.py output $K /tmp/claude-0/kaggle_$K
for e in "$@"; do [ -f /tmp/claude-0/kaggle_$K/voix_$e.zip ] && unzip -o -q /tmp/claude-0/kaggle_$K/voix_$e.zip -d . && n=$(ls $e/voix/*.mp3 2>/dev/null | wc -l) && echo "$e : $n voix" && [ "$n" -ge 30 ] && echo "VOIX $e FIN" >> travail_voix.log; done
