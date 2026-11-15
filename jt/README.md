# L'Écho du Jour — rendu vidéo

JT quotidien d'environ 47 s au format TikTok (1080 x 1920, 24 i/s), style actualités filmées des années 1930.

## Faire une édition

1. Copier `editions/2026-11-15-1.js` en `editions/AAAA-MM-JJ-N.js` et changer les textes (accroche, 3 rubriques, question).
   Les mots entre `*astérisques*` sont surlignés dans les sous-titres. Illustrations disponibles : `pay`, `stage`, `mic`, `globe`.
2. Lancer :

```
pip install piper-tts && tools/voices.sh       # une seule fois (voix Piper, ~200 Mo)
python3 -I tools/grain.py                      # une seule fois
node tools/voice.js AAAA-MM-JJ-N               # voix de Maurice (Tom, style réclame) + bouche
python3 -I tools/audio.py out/audio.wav        # musique et bruitages
node render.js AAAA-MM-JJ-N                    # images
cd out
ffmpeg -i audio.wav -i voice-AAAA-MM-JJ-N.wav -filter_complex \
  "[1]asplit=2[sc][v];[0][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[m];[m][v]amix=inputs=2:normalize=0:weights=0.8 1.25,loudnorm=I=-14:TP=-1.5" mix.wav
ffmpeg -framerate 24 -i frames-AAAA-MM-JJ-N/%05d.jpg -i mix.wav -c:v libx264 -crf 23 -maxrate 4500k \
  -bufsize 9000k -pix_fmt yuv420p -c:a aac -shortest ecodujour-AAAA-MM-JJ-N.mp4
```

Les textes dits par Maurice sont dans `say`, `hookSay`, `questionSay` et `subscribeSay` (nombres en toutes lettres,
`|` = nouvelle phrase, la voix monte d'un cran). La ligne de temps commune est dans `timeline.js`.

Aperçu de quelques images : `node render.js AAAA-MM-JJ-N --preview 1.5,6,19`.

Voix : Piper (fr_FR-tom-medium), passée dans un filtre « réclame années 30 » (`tools/reclame.sh`).
