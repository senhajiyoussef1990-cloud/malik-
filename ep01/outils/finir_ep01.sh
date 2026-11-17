#!/bin/sh
# Attend le lot Kaggle de l'épisode 1, récupère les plans, remplace les plans refaits, puis monte l'épisode.
cd /home/user/malik-/ep01/kaggle || exit 1
LOG=../travail/finir.log; echo "début $(date -u +%H:%M)" > $LOG
i=0
while [ $i -lt 60 ]; do
  s=$(python3 kg.py status ep01-episode 2>/dev/null); echo "$(date -u +%H:%M) $s" >> $LOG
  echo "$s" | grep -qE '"status": *"(complete|error)"' && break
  i=$((i+1)); sleep 120
done
python3 kg.py output ep01-episode clips >> $LOG 2>&1
for n in 02 03 04 14 15; do [ -s clips_refait/Scene_$n.mp4 ] && cp clips_refait/Scene_$n.mp4 clips/Scene_$n.mp4 && echo "remplacé $n" >> $LOG; done
cd /home/user/malik-/ep01/outils && python3 bande_clips.py >> $LOG 2>&1 && cd .. && python3 outils/montage.py >> $LOG 2>&1
echo "FIN $? $(date -u +%H:%M)" >> $LOG
