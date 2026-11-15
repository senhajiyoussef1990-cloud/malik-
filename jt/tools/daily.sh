#!/bin/sh
# Fabrique toute l'édition : voix, musique, vidéo, image de story, texte de publication.
# Usage : tools/daily.sh AAAA-MM-JJ-N   (l'édition editions/AAAA-MM-JJ-N.js doit exister)
set -e
ED=$1
cd "$(dirname "$0")/.."
export HF_HUB_DISABLE_XET=1
node tools/voice.js "$ED"
python3 -I tools/audio.py out/audio.wav "out/timeline-$ED.js"
rm -rf "out/frames-$ED"
node render.js "$ED"
node render.js "$ED" --story
cd out
ffmpeg -nostdin -y -loglevel error -i audio.wav -i "voice-$ED.wav" -filter_complex \
  "[1]asplit=2[sc][v];[0][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[m];[m][v]amix=inputs=2:normalize=0:weights=0.8 1.25,loudnorm=I=-14:TP=-1.5" \
  -ar 44100 mix.wav
ffmpeg -nostdin -y -loglevel error -framerate 24 -i "frames-$ED/%05d.jpg" -i mix.wav -c:v libx264 -preset medium \
  -crf 23 -maxrate 4500k -bufsize 9000k -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart "ecodujour-$ED.mp4"
node -e "global.window={};require('../editions/$ED.js');process.stdout.write(window.EDITION.caption+'\n')" > "publication-$ED.txt"
rm -rf "frames-$ED" mix.wav audio.wav
echo "ok : out/ecodujour-$ED.mp4  out/story-$ED.jpg  out/publication-$ED.txt"
ffprobe -v error -show_entries format=duration -of csv=p=0 "ecodujour-$ED.mp4"
