# L'Écho du Jour — rendu vidéo

JT quotidien d'environ 47 s au format TikTok (1080 x 1920, 24 i/s), style actualités filmées des années 1930.

## Faire une édition

1. Copier `editions/2026-11-15-1.js` en `editions/AAAA-MM-JJ-N.js` et changer les textes (accroche, 3 rubriques, question).
   Les mots entre `*astérisques*` sont surlignés dans les sous-titres. Illustrations disponibles : `pay`, `stage`, `mic`, `globe`.
2. Lancer :

```
python3 -I tools/grain.py                     # une seule fois
python3 -I tools/audio.py out/audio.wav
node render.js AAAA-MM-JJ-N
ffmpeg -framerate 24 -i out/frames-AAAA-MM-JJ-N/%05d.jpg -i out/audio.wav \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -shortest out/ecodujour-AAAA-MM-JJ-N.mp4
```

Aperçu de quelques images : `node render.js AAAA-MM-JJ-N --preview 1.5,6,19`.

Pas de voix pour l'instant : seule une synthèse vocale anglaise est disponible dans ce conteneur.
