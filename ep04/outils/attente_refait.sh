#!/bin/sh
# Attend les plans refaits (scènes 1 et 15), les remplace et remonte l'épisode.
cd /home/user/malik-/ep04/kaggle || exit 1
LOG=../travail/refait_plans.log; echo "début $(date -u +%H:%M)" > $LOG
i=0
while [ $i -lt 40 ]; do
  s=$(python3 kg.py status ep04-refait 2>/dev/null); echo "$(date -u +%H:%M) $s" >> $LOG
  echo "$s" | grep -qE '"status": *"(complete|error)"' && break
  i=$((i+1)); sleep 180
done
mkdir -p clips_refait && python3 kg.py output ep04-refait clips_refait >> $LOG 2>&1
for n in 01 15; do [ -s clips_refait/Scene_$n.mp4 ] && cp clips_refait/Scene_$n.mp4 clips/Scene_$n.mp4 && echo "remplacé $n" >> $LOG; done
sh /home/user/malik-/ep04/outils/monte.sh
echo "FIN $(tail -1 ../travail/montage_final.log) $(date -u +%H:%M)" >> $LOG
