# L'Écho du Jour — édition quotidienne

Instructions pour la session programmée tous les jours à 8 h 55 (heure de Paris), livraison visée vers 9 h 45.
But : livrer **avant 12 h** la vidéo, le texte de publication et l'image de story. L'utilisateur publie à **12 h 30** et doit avoir le temps de vérifier.

## 1. Préparer

```
git fetch origin jt && git checkout jt && git pull origin jt
cd jt
```

La voix de l'utilisateur (Chatterbox), Whisper et Piper sont installés par le script de mise en place de l'environnement.
Si `/root/venvs/cb/bin/python` n'existe pas, installer :
`uv venv -p 3.12 /root/venvs/cb && VIRTUAL_ENV=/root/venvs/cb uv pip install chatterbox-tts "setuptools<81"`
puis `pip install piper-tts faster-whisper && pip install --no-deps num2words`.

## 2. Choisir les 3 sujets

Chercher sur le web **uniquement des faits survenus la veille** (le jour J-1, heure de Paris) et ouvrir les articles. Pas d'annonce d'un événement à venir, pas de chiffre publié plusieurs jours avant, pas de « sujet de fond » : si rien d'assez fort ne s'est passé la veille dans une rubrique, prendre un autre fait de la veille.

| Rubrique | Bandeau | Ce qu'on cherche |
|---|---|---|
| 1 | `EN FRANCE` | Une actu française importante ou marquante |
| 2 | `DANS LE MONDE` | Une actu internationale forte |
| 3 | `L'INSOLITE` | Une histoire vraie, légère et surprenante |

Règles (non négociables) :

- Chaque sujet confirmé par **au moins deux médias sérieux**, liens notés.
- **Pas de drame traité en divertissement** : pas d'attentat, de mort, d'accident grave ni de victimes. Si l'actu majeure est un drame, choisir un autre sujet important.
- **Neutralité politique** : les faits, sans opinion ni moquerie envers un camp ou une personne.
- **Insolite** : vrai et vérifié, jamais une rumeur ni un canular.
- **Texte réécrit** avec ses propres mots, jamais recopié.
- **Dessins** : objets, lieux, cartes, animaux, symboles. Jamais le visage d'une personne réelle, jamais de logo.
- Préférer les sujets qui intriguent (record, première, découverte) aux sujets purement institutionnels.

## 3. Écrire l'édition

Copier `editions/2026-11-15-1.js` en `editions/AAAA-MM-JJ-1.js` et tout remplacer :

- `date` : « JOUR JJ MOIS AAAA » en majuscules.
- `hook` / `hookSay` : une phrase-choc sur l'insolite (2 lignes courtes).
- Par rubrique : `category`, `title` (≤ 40 caractères), `illustration`, **4** `subs` et 4 `say`.
  - `subs` : 2 lignes de **26 caractères maximum** chacune, mot clé entre `*astérisques*`.
  - `say` : ce que dit Maurice, nombres et sigles **en toutes lettres**, `|` entre deux phrases.
- `question` / `questionSay` : une question qui fait commenter, liée à un sujet.
- `phonetic` : orthographe phonétique des noms propres difficiles (pour la voix seulement).
- `caption` : 1 à 2 phrases + la question + 5 à 7 hashtags (`#actu #info #journal #ecodujour` + sujets).
- `voiceEngine: "clone"` (voix de l'utilisateur). Garder `storyCta`.

Illustrations disponibles : `pay`, `stage`, `mic`, `globe`, `boat`, `rocket`, `probe`.
Si aucune ne convient, en ajouter une dans `scene.html` (fonction `buildXxx` + branche dans `updateIll` + nom dans la liste), dans le même style sépia, puis vérifier avec `node render.js ED --preview 8,12`.

## 3 bis. Faire vérifier

Avant tout rendu, lance le sous-agent **`verificateur`** (`.claude/agents/verificateur.md`) avec le chemin de l'édition et les liens des sources trouvées.
S'il répond **À CORRIGER**, applique ses corrections dans l'édition, puis relance-le jusqu'à **VALIDÉ** (2 allers-retours maximum ; s'il reste un doute sur un sujet, remplace ce sujet).
Si le sous-agent n'est pas disponible, fais toi-même ses contrôles en suivant ce fichier.

## 4. Fabriquer

```
tools/daily.sh AAAA-MM-JJ-1      # ~15 à 20 min
```

Vérifier dans la sortie : chaque ligne `qc` ≥ 0,75 (sinon reformuler la réplique `say` et relancer, le cache garde les autres) et une durée totale ≥ 60 s.
Regarder 4 images : `node render.js AAAA-MM-JJ-1 --preview 2,10,30,50`, puis `out/story-AAAA-MM-JJ-1.jpg`.

## 5. Livrer (avant 12 h)

Envoyer à l'utilisateur avec l'outil d'envoi de fichiers (statut proactif) :

1. `out/ecodujour-AAAA-MM-JJ-1.mp4`
2. `out/story-AAAA-MM-JJ-1.jpg`
3. `out/publication-AAAA-MM-JJ-1.txt`

Puis un message court en français : les 3 sujets en une ligne chacun, le texte de publication prêt à copier, les liens des sources, et toute réserve (source unique, info qui peut évoluer).

## 6. Sauvegarder

Commiter sur la branche `jt` l'édition, `out/story-*.jpg`, `out/publication-*.txt`, `out/timeline-*.js`, `out/voice-*.js` et toute nouvelle illustration, puis `git push origin jt`.
Ne jamais commiter les `.mp4` (trop lourds, déjà ignorés).
