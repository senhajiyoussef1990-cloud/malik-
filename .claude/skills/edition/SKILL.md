---
name: edition
description: Fabrique et livre une édition de « L'Écho du Jour », le JT TikTok quotidien (vidéo, image de story, texte de publication). À lancer avec /edition, éventuellement suivi d'une date ou d'une consigne (« refais l'insolite », « 2026-11-20 », « voix Tom »).
disable-model-invocation: true
argument-hint: "[date AAAA-MM-JJ] [consigne]"
---

# /edition — L'Écho du Jour

Consigne de l'utilisateur : $ARGUMENTS

Réponds en français. Le projet est dans `jt/` sur la branche `jt`.

## Comprendre la demande

- **Sans consigne** : édition complète du jour (date de Paris), fichier `jt/editions/AAAA-MM-JJ-1.js`.
- **Une date** : même chose pour cette date.
- **« refais / change » + une rubrique** (France, Monde, Insolite, accroche, question) : reprends l'édition existante du jour, ne remplace que cette partie, garde tout le reste. Le cache de voix évite de régénérer les répliques inchangées.
- **« voix Tom »** : `voiceEngine` absent (voix Piper) au lieu de `"clone"`.
- **« juste le texte » / « juste la story »** : ne régénère pas la vidéo (`node render.js ED --story` suffit pour la story, `jt/out/publication-ED.txt` pour le texte).

## Déroulé

Suis `jt/QUOTIDIEN.md` étape par étape. Rappels essentiels :

1. `git fetch origin jt && git checkout jt && git pull origin jt`. Vérifie que `/root/venvs/cb/bin/python` existe, sinon installe comme indiqué dans QUOTIDIEN.md.
2. **Sujets** : **uniquement des faits survenus la veille** (J-1), jamais un événement à venir ni un chiffre de plusieurs jours, ouvre les articles, **deux sources sérieuses** par sujet. Pas de drame traité légèrement, neutralité politique, insolite vrai, aucun visage réel ni logo.
3. **Édition** : 4 sous-titres par rubrique, **26 caractères maximum par ligne**, `say` avec nombres en toutes lettres, `phonetic` pour les noms difficiles, `caption` avec question et hashtags.
4. **Vérification** : lance le sous-agent `verificateur` avec le chemin de l'édition et les liens des sources ; applique ses corrections jusqu'à **VALIDÉ** avant tout rendu.
5. **Illustration** : si aucune de `pay, stage, mic, globe, boat, rocket, probe` ne convient, ajoute-en une dans `jt/scene.html` (même style sépia) et vérifie-la avec `node render.js ED --preview 8,12`.
6. **Fabrication** : `jt/tools/daily.sh ED`. Contrôle les lignes `qc` (≥ 0,75, sinon reformule la réplique et relance) et la durée (≥ 60 s). Regarde quelques images avec `--preview`.
7. **Livraison** : envoie `jt/out/ecodujour-ED.mp4`, `jt/out/story-ED.jpg` et `jt/out/publication-ED.txt` avec l'outil d'envoi de fichiers. Message court : les 3 sujets, le texte de publication prêt à copier, les sources, les réserves.
8. **Sauvegarde** : commite l'édition, la story, le texte, `out/timeline-ED.js`, `out/voice-ED.js` et toute nouvelle illustration sur `jt` (jamais de `.mp4`), puis `git push origin jt`.

Si la consigne contredit une règle éditoriale, applique la règle et explique pourquoi.
