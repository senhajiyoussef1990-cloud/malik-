# Quiz YouTube — foot et logique

Génère automatiquement des vidéos de quiz à choix multiples (A, B, C, D) :
voix off, compte à rebours, révélation de la bonne réponse et écran de fin.

## Fabriquer une vidéo

```bash
pip install edge-tts numpy pillow      # une seule fois (ffmpeg doit être installé)
python3 outils/generer.py questions/foot_01.json          # Short vertical 1080x1920
python3 outils/generer.py questions/foot_01.json --long   # vidéo longue 1920x1080
```

La vidéo sort dans `sortie/`.

## Ajouter un quiz

Copier un fichier de `questions/` et changer le texte :

- `theme` : `foot` (fond terrain vert) ou `logique` (fond violet)
- `reponse` : numéro de la bonne réponse, **en partant de 0** (0 = A, 1 = B, 2 = C, 3 = D)
- `explication` (facultatif) : phrase dite après la réponse
- `pause` (facultatif) : phrase « mets pause » de l'intro (par défaut : « Si tu as besoin de réfléchir, mets pause ! »)

## Voix

Par défaut : voix française gratuite Microsoft (`fr-FR-RemyMultilingualNeural`).
Autre voix : `QUIZ_VOIX_EDGE=fr-FR-HenriNeural`. ElevenLabs : `QUIZ_TTS=eleven`
(compte payant nécessaire).
