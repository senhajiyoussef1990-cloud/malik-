# Chrono Quiz — Shorts YouTube (foot, logique, culture générale)

Génère automatiquement des Shorts de quiz à choix multiples (A, B, C, D) avec l'identité
**Chrono Quiz** : intro animée, voix off, compte à rebours de 4 secondes, révélation de la
réponse, écran de fin « Ton score ? / Abonne-toi ».

## Fabriquer les vidéos

```bash
pip install edge-tts numpy pillow       # une seule fois (ffmpeg doit être installé)
python3 outils/generer.py --tous                     # les 10 épisodes
python3 outils/generer.py episodes/ep03_foot.json    # un seul épisode
python3 outils/marque.py                             # photo de profil + bannière de la chaîne
```

Les vidéos et un texte de publication (titre, description, hashtags) sortent dans `sortie/`.
La photo de profil et la bannière sortent dans `marque/`.

## Fichier d'un épisode (`episodes/`)

- `numero`, `theme` : `foot` (fond terrain vert), `logique` (fond violet) ou `culture` (culture générale, fond bleu)
- `accroche` : phrase dite dans l'intro, après « Bienvenue dans Chrono Quiz ! Spécial … »
- `titre_youtube` : titre proposé pour la publication
- `pause_par_question` : `true` = après chaque question, la voix dit « Besoin de réfléchir ? Appuie sur pause ! » (logique), `false` = rien (foot, culture)
- `questions` : 5 questions, chacune avec
  - `choix` : 4 réponses
  - `reponse` : numéro de la bonne réponse, **en partant de 0** (0 = A, 1 = B, 2 = C, 3 = D)
  - `niveau` : `facile`, `moyen` ou `difficile` (affiché dans la vidéo, et servira à
    assembler plus tard les vidéos longues facile / moyen / difficile)
  - `explication` (facultatif) : phrase dite après la réponse

## Voix

Par défaut : voix française gratuite Microsoft (`fr-FR-RemyMultilingualNeural`).
Autre voix : `QUIZ_VOIX_EDGE=fr-FR-HenriNeural`. ElevenLabs : `QUIZ_TTS=eleven` (compte payant).

Rotation des épisodes : foot → logique → culture générale. Des épisodes prêts en avance sont rangés dans `episodes/reserve/`.

## Plan et ChatGPT

- [`PLAN_100_EPISODES.md`](PLAN_100_EPISODES.md) : les 100 premiers épisodes (thème, sujet, accroche, titre).
- [`GUIDE_CHATGPT.md`](GUIDE_CHATGPT.md) : le message à coller dans ChatGPT pour écrire un épisode au bon format.
