#!/bin/sh
# Voix « réclame des années 30 » : reclame.sh voix sortie.wav "Phrase 1|Phrase 2|..." [speaker]
# Chaque phrase est synthétisée à part et monte un peu plus haut que la précédente,
# pour imiter l'intonation enjouée des anciennes publicités. Son de disque 78 tours.
V=$1; OUT=$2; TXT=$3; SPK=$4
D=$(dirname "$0"); TMP=$(mktemp -d)
SR=$(python3 -c "import json;print(json.load(open('$D/../voices/$V.onnx.json'))['audio']['sample_rate'])")
i=0; list=""
echo "$TXT" | tr '|' '\n' > "$TMP/phrases"
while IFS= read -r p; do
  P=$(python3 -c "print(round(1.22 + 0.035*min($i,4), 3))")
  echo "$p" | piper -m "$D/../voices/$V.onnx" ${SPK:+-s $SPK} --length-scale 0.92 --noise-scale 0.85 --noise-w-scale 1.0 -f "$TMP/r$i.wav" 2>/dev/null
  ffmpeg -nostdin -y -loglevel error -i "$TMP/r$i.wav" -af "asetrate=$SR*$P,aresample=44100,apad=pad_dur=0.12" -ac 1 "$TMP/p$i.wav"
  list="$list -i $TMP/p$i.wav"; i=$((i+1))
done < "$TMP/phrases"
ffmpeg -nostdin -y -loglevel error $list -filter_complex "concat=n=$i:v=0:a=1,highpass=f=450,lowpass=f=3000,equalizer=f=1600:t=q:w=1:g=8,acompressor=threshold=-20dB:ratio=6:attack=3:release=60,asoftclip=type=tanh:param=1.5,vibrato=f=0.7:d=0.03,aecho=0.8:0.4:25|50:0.2|0.1[v];anoisesrc=c=brown:a=0.02:r=44100,highpass=f=300[n];[v][n]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5" -ar 44100 -ac 1 "$OUT"
rm -rf "$TMP"
