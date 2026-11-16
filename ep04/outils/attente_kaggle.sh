#!/bin/sh
# Attend la fin du lot Kaggle, télécharge les plans animés et monte l'épisode (aucune intervention nécessaire).
cd "$(dirname "$0")/.." || exit 1
LOG=travail/attente.log; echo "début $(date -u +%H:%M)" > $LOG
i=0
while [ $i -lt 96 ]; do
  s=$(cd kaggle && python3 kg.py status ep04-episode 2>/dev/null)
  echo "$(date -u +%H:%M) $s" >> $LOG
  echo "$s" | grep -qE '"status": *"(complete|error|cancelAcknowledged)"' && break
  i=$((i+1)); sleep 300
done
(cd kaggle && python3 kg.py output ep04-episode clips) >> $LOG 2>&1
ls -la kaggle/clips >> $LOG
(cd outils && python3 bande_clips.py) >> $LOG 2>&1 && python3 outils/montage.py >> $LOG 2>&1
echo "FIN $? $(date -u +%H:%M)" >> $LOG
