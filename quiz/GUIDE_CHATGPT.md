# Guide : écrire un épisode Chrono Quiz avec ChatGPT

Ce guide sert à faire écrire les questions d'un épisode par ChatGPT (ou tout autre assistant),
dans le format exact que le générateur de vidéos attend.

Étapes :
1. Choisir un épisode « À faire » dans [`PLAN_100_EPISODES.md`](PLAN_100_EPISODES.md).
2. Copier le **message à coller** ci-dessous dans ChatGPT, en remplaçant les 4 valeurs entre crochets.
3. Vérifier les réponses de ChatGPT (voir « À vérifier »).
4. Enregistrer le résultat dans `quiz/episodes/`, par exemple `ep11_logique.json`.
5. Fabriquer la vidéo : `python3 quiz/outils/generer.py quiz/episodes/ep11_logique.json`
   (ou demander à Claude Code de le faire), puis marquer l'épisode « ✅ Fait » dans le plan.

---

## Message à coller dans ChatGPT

```text
Tu écris un épisode de « Chrono Quiz », une chaîne YouTube de Shorts de quiz en français.

Épisode : [NUMÉRO, ex. 11]
Thème : [foot | logique | culture]
Sujet : [SUJET DU PLAN, ex. Suites de nombres]
Accroche : [ACCROCHE DU PLAN, ex. Presque personne ne trouve la dernière !]

Règles :
- Exactement 5 questions à choix multiples, 4 choix chacune.
- Difficulté croissante : questions 1 et 2 « facile », 3 et 4 « moyen », 5 « difficile ».
- Une seule bonne réponse, sans aucun doute possible. Les 3 mauvaises réponses doivent être crédibles.
- Questions courtes : 15 mots maximum (elles sont lues à voix haute et le joueur a 4 secondes).
- Choix courts : 25 caractères maximum.
- Uniquement des faits stables qui ne changeront pas : pas de « actuel », « en ce moment »,
  « cette saison », pas de joueur ou entraîneur dont le club peut changer, pas de record
  qui peut encore être battu bientôt.
- Foot : histoire, règles, clubs, stades, surnoms, grandes compétitions passées.
- Logique : énigmes qui se résolvent sans connaissances, juste en réfléchissant.
  Chaque question a une « explication » courte (1 phrase) qui dit pourquoi c'est la bonne réponse.
- Culture : faits connus et vérifiables. « explication » facultative (1 phrase).
- La bonne réponse ne doit pas toujours être à la même place (varier A, B, C, D).
- Écris les nombres en chiffres, en français correct, avec les accents.
- « reponse » est la position de la bonne réponse en partant de 0 : 0 = A, 1 = B, 2 = C, 3 = D.
- « pause_par_question » vaut true pour la logique, false pour le foot et la culture.

Réponds uniquement avec le JSON, sans texte autour, dans ce format exact :

{
  "numero": 11,
  "theme": "logique",
  "accroche": "Presque personne ne trouve la dernière !",
  "titre_youtube": "Quiz logique : Suites de nombres 🧠",
  "pause_par_question": true,
  "questions": [
    {
      "question": "Quel nombre continue la suite : 3, 6, 9, 12… ?",
      "choix": ["13", "14", "15", "18"],
      "reponse": 2,
      "niveau": "facile",
      "explication": "On ajoute 3 à chaque fois."
    }
  ]
}

(La liste « questions » doit contenir les 5 questions.)
```

---

## À vérifier avant de fabriquer la vidéo

- [ ] 5 questions, 4 choix chacune, niveaux facile, facile, moyen, moyen, difficile.
- [ ] Pour chaque question, `reponse` pointe bien vers la bonne réponse (0 = A, 1 = B, 2 = C, 3 = D).
      **C'est l'erreur la plus fréquente** : relire chaque question.
- [ ] Les faits sont vrais. En cas de doute sur une question, demander à ChatGPT de la remplacer.
- [ ] Pas de fait qui peut changer bientôt (club actuel d'un joueur, classement en cours…).
- [ ] La même question n'existe pas déjà dans un autre épisode (`quiz/episodes/`).
- [ ] Le fichier s'appelle `epNN_theme.json` avec le numéro sur 2 chiffres : `ep11_logique.json`,
      `ep12_culture.json`, `ep13_foot.json`… (au-delà de 99 : `ep100_foot.json`).

Pour faire vérifier le JSON par ChatGPT lui-même, coller ce message après sa réponse :

```text
Relis ton JSON question par question. Pour chacune, écris la lettre de la bonne réponse
selon « reponse » (0 = A, 1 = B, 2 = C, 3 = D) et confirme que c'est vrai. Corrige s'il y a une erreur,
puis redonne le JSON complet.
```

---

## Les champs du fichier

| Champ | Rôle |
|---|---|
| `numero` | Numéro de l'épisode (affiché « ÉPISODE 11 ») |
| `theme` | `foot`, `logique` ou `culture` : choisit les couleurs et le fond |
| `accroche` | Dite dans l'intro, après « Bienvenue dans Chrono Quiz ! Spécial … » |
| `titre_youtube` | Titre proposé dans le texte de publication |
| `pause_par_question` | `true` : après chaque question, la voix dit « Besoin de réfléchir ? Appuie sur pause ! » |
| `questions[].question` | Texte de la question (lu par la voix) |
| `questions[].choix` | Les 4 réponses A, B, C, D |
| `questions[].reponse` | Position de la bonne réponse, en partant de 0 |
| `questions[].niveau` | `facile`, `moyen` ou `difficile` (affiché, et sert pour les futures vidéos longues) |
| `questions[].explication` | Facultatif : phrase dite après la réponse |

Exemples complets : les fichiers `quiz/episodes/ep01_foot.json` à `ep10_foot.json`.
