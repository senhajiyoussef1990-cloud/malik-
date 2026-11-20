# « Ne suis pas les moutons » — guide pour reprendre la production (ChatGPT ou toute autre IA)

Ce dépôt contient **tout** ce qu'il faut pour fabriquer les épisodes de la série : personnages, décors, scènes, voix, outils
de montage et textes de publication. Ce guide explique le projet, les règles artistiques à respecter (décidées avec
l'auteur, épisode après épisode) et la marche à suivre pour faire un nouvel épisode.

- Dépôt : `senhajiyoussef1990-cloud/malik-`, branche **`claude/wonderful-sagan-3cr70a`**.
- Tout est en français : textes, commentaires du code, publications.

---

## 1. Le concept

Pages « ne.suit.pas.lesmoutons » / « Ne suis pas les moutons » : dessins animés satiriques verticaux (9:16) sur les
mécanismes d'influence (preuve sociale, répétition, peur, cadrage, illusion du choix, urgence, autorité, récompense
imprévisible, chambre d'écho, indignation).

- **Le salon, en couleur** (années 1950 revisitées) : le **Renard** (malin, calme, bienveillant) et le **Mouton**
  (curieux, se fait avoir puis comprend).
- **Le téléviseur, en noir et blanc** (cinéma des années 1930) : une petite fable avec des **humains**, racontée par le
  **narrateur**. Effet de vieux film (grain, rayures, scintillement) **seulement** dans la télé.
- Les scénarios sont dans `episodes_pdf/` (10 PDF + leur texte extrait `.txt`) : 30 plans, une réplique par plan.
  **Le texte des répliques doit être respecté mot pour mot.**
- Phrase de fin commune (voix du narrateur, sur le logo dans la télé) :
  « Arrête de suivre le troupeau. Suis le renard… et pense par toi-même ! »

### Épisodes

| N° | Titre | Dossier des données | Dossier des scènes | État |
|----|-------|---------------------|--------------------|------|
| 01 | La preuve sociale | `preuve_sociale/` | `anim_code/preuve_sociale/` | livré |
| 02 | La répétition | `repetition/` | `anim_code/repetition/` | livré |
| 03 | La peur et la rumeur | `peur_rumeur/` | `anim_code/peur_rumeur/` | livré |
| 04 | Le pouvoir du cadrage | `cadrage/` | `anim_code/cadrage/` | livré |
| 05 | Tu crois choisir ? (l'illusion du choix) | `ep01/` (ancien nom) | `anim_code/ep01/` | livré (ancien style) |
| 06 | L'urgence artificielle | `urgence/` | `anim_code/urgence/` | en fabrication |
| 07 | L'autorité mise en scène | `autorite/` | `anim_code/autorite/` | en fabrication |
| 08 | La récompense imprévisible | `recompense/` | `anim_code/recompense/` | en fabrication |
| 09 | La chambre d'écho | `echo/` | `anim_code/echo/` | en fabrication |
| 10 | La colère contagieuse | `indignation/` | `anim_code/indignation/` | en fabrication |
| 11 | Le mythe du bacon (Bernays, 1925) | `bacon/` | `anim_code/bacon/` | prêt — voix faites, rendu en cours |
| 12 | Le jus d'orange du matin (Californie, 1910) | `orange/` | `anim_code/orange/` | prêt à lancer — voix en cours |
| 13 | Le saumon des sushis (Norvège/Japon, 1986) | `saumon/` | `anim_code/saumon/` | prêt à lancer (en file) |
| 14 | Le diamant éternel (New York, 1938-1947) | `diamant/` | `anim_code/diamant/` | prêt à lancer (en file) |
| 15 | Les torches de la liberté (New York, 1929) | `torches/` | `anim_code/torches/` | prêt à lancer (en file) |
| 16 | La réduflation | `reduflation/` | `anim_code/reduflation/` | prêt à lancer (en file) |
| 17 | La chanson qu'on finit par aimer (payola, 1950-1959) | `chanson/` | `anim_code/chanson/` | prêt à lancer (en file) |
| 18 | L'ampoule programmée (cartel Phœbus, 1924) | `ampoule/` | `anim_code/ampoule/` | prêt à lancer (en file) |
| 19 | La Guerre des mondes (1938) | `martiens/` | `anim_code/martiens/` | prêt à lancer (en file) |

« Prêt à lancer » = répliques, décors, 16 scènes, montage et publications écrits ; il ne reste que la fabrication :
`sh outils_commun/voix_episodes.sh <ep>` puis `sh outils_commun/fin_<ep>.sh` (ou `episode.sh`, voir section 4).
Les épisodes 6 à 10 ont leurs scènes écrites ; EP06 n'attend plus que la scène 5 et le montage, EP07-10 attendent leurs voix.

La suite : les 50 sujets de `SUJETS_50_EPISODES.md` (histoires vraies du livre *Influencer les masses*). Les épisodes 11 à 14 sont
les meilleurs modèles : même structure, un salon avec une **table** (petit-déjeuner, sushis, écrin…), une histoire vraie dans la télé,
des personnages nommés (`who` : `charcutier`, `bernays`, `producteur`, `cheffe`… déclarés dans `outils_commun/prises.py` → `JEU`
et dans `<ep>/outils/montage.py` → `NOMS`).

(L'ancien `ep04/` est une première version obsolète faite avec un autre procédé ; ne pas l'utiliser.)

---

## 2. Règles artistiques (décidées avec l'auteur — à respecter)

**Personnages**
- Toujours conformes aux fiches de `anim_code/ref/` (renard et mouton, face et dos). On garde **nos** personnages,
  pas les descriptions vestimentaires des PDF.
- Renard : tête en losange légèrement arrondi avec petites touffes aux joues, petites oreilles derrière le crâne, cou
  visible, bouche fine, chemise bien visible, costume brun à rayures, cravate orange, chaîne de montre.
- Mouton : laine seulement en frange et sur les côtés (pas au menton), longues oreilles visibles, silhouette mince,
  jambes fines, chaussures qui touchent les chaussettes, casquette tweed, gilet, nœud papillon.
- **Aucune démarcation entre les parties du corps** (épaules, coudes, genoux…) : un seul contour autour de la silhouette.
- Épaules et bras alignés à la même hauteur des deux côtés.
- Mains : au repos, **vues de profil** (pouce devant le long du bord, doigts presque droits, légère courbe), jamais le
  pouce posé sur le dos de la main. Bout des manches = **poignet de chemise rectangulaire à bouton**, pas une ellipse.
- Les objets tenus ne doivent **jamais cacher un visage**.

**Rendu « dessin »** (pas « superposition d'images par code »)
- Trait d'encre fin, brun, irrégulier, qui vibre légèrement (crayon) ; texture gouache ; grain de papier.
- Lettrage peint à la main (lettres irrégulières).
- Ombre au sol, lumière chaude d'un côté, têtes de trois quarts quand ils regardent quelqu'un, pose naturelle.
- Calcul en **double définition** (4× plus de pixels) réduit en 1080 × 1920 : plus de détails, **même format**.

**Animation**
- Rythme naturel : pauses courtes (0,3 s même personnage, 0,5 s changement de personnage, un peu plus s'il y a une action),
  pas de longs blancs. La durée n'a pas besoin d'atteindre 2 min 30 : le naturel prime.
- Gestes calés sur les mots importants (anticipation + rebond), respiration, transfert de poids, coups d'œil,
  celui qui écoute réagit, formes de bouche selon les sons, vraies coupes de plans (pas de zooms inutiles).
- Le narrateur ne parle **que** dans la télé (y compris pendant la plongée dans l'écran et la sortie).
- Écran de fin : logo dans la télé, et la **tête du renard** surgit dans le coin et fait un **clin d'œil**.

**Voix**
- Renard, Mouton, Narrateur : clones des enregistrements ElevenLabs de l'auteur (`voix/refs/ref-eleven-*.wav`).
- Personnages de la télé : `ref-tv-homme.wav` (ElevenLabs) et `ref-tv-femme.wav`.
- Mouton **posé**, pas trop enthousiaste. Voix des personnages légèrement accélérées (×1,07), narrateur ×1,12.
- Aucun bruit parasite, aucune répétition de fin de phrase, aucun mot coupé : chaque réplique est vérifiée par
  transcription (Whisper) et comparée au texte.

**Livraison (par épisode)** : un **zip** avec la vidéo `EPxx_….mp4` (sous-titres incrustés, titre et sous-titre en
haut, filigrane « © Ne suis pas les moutons »), le fichier texte des **publications** (Facebook, Instagram, TikTok,
YouTube Shorts, avec hashtags, titre et tags YouTube), l'**image de story** 1080×1920 et la **couverture**.
Pas de bande-annonce.

---

## 3. Organisation du dépôt

```
anim_code/                  le dessin animé, entièrement dessiné en code (Canvas 2D, rendu par Chromium)
  persos.js                 le Renard et le Mouton (drawRenard, drawMouton), mains, poignets, style dessin
  humains.js                humains N&B années 30, couvre-chefs, effet vieux film, enNoirEtBlanc, caméra cam()
  decor_salon.js            le salon couleur (télé, horloge, miroir, fenêtre, tapis…) ; options par épisode THEME_SALON
  vivant.js                 animation « vivante » + rendu dessin des personnages (dessinTrace) + plans
  dessin.js                 post-traitement « fait main » (trait au crayon, gouache, papier, lettrage peint)
  hidpi.js                  rendu en double définition
  rendu_scene.js            rend UNE scène : node rendu_scene.js <épisode> <NN>
  <épisode>/commun.js       outils et accessoires communs à l'épisode (salon, voix(), objets du salon)
  <épisode>/tv.js           le monde N&B de l'épisode (décors, figurants)
  <épisode>/sceneNN.js      une scène = DUREE + frame(c, t)
<épisode>/                  les données de l'épisode
  lignes.json               les répliques : id (s01a…), plan, scene, who (renard|mouton|narr|figurant|figurante), pause, text
  voix/refs/                voix de référence ; voix/<id>.mp3 = répliques finales
  outils/montage.py         montage final (titre, sous-titres, musique, bruitages, couverture)
  outils/minutage.py        minutage mot à mot des voix
  sortie/                   livrables
outils_commun/
  prises.py                 génère les prises de voix (Chatterbox, clonage)
  choix_prises.py           garde la meilleure prise (Whisper), coupe les parasites, nettoie
  nettoie_voix.py           enlève le souffle
  voix_episodes.sh          voix de plusieurs épisodes à la suite
  episode.sh                chaîne complète d'un épisode : minutage → rendu des scènes → montage → story → zip
  story.py                  image de story
episodes_pdf/               les 10 scénarios (PDF + texte)
```

### Écrire une scène
Chaque `sceneNN.js` reçoit `L` (`L.id = [début, durée, qui]`, calé sur les vraies voix), `MOTS` (minutage mot à mot) et
`BOUCHE`. Il définit `DUREE` et `frame(c, t)`. Modèles à copier : `anim_code/urgence/scene01.js` (salon),
`scene04.js` (télé N&B), `scene07.js` (héros en couleur dans le monde N&B), `scene03.js` / `scene14.js`
(plongée dans l'écran / retour), `scene16.js` (logo final + clin d'œil).
Outils utiles : `renardBase(t)`, `moutonBase(t)`, `voix(P, ids, t)`, `dessineSalon(c, t, R, M, o, avant)`,
`enNoirEtBlanc(c, t, dessin)`, `nbEtCouleur(...)`, `cam(c, t, clés)`, `camEcran(c, u, de)`, `figurant(t, x, v, o)`,
`dessine(c, P)`, `COIFFE.*`, `ease`, `seg`, `lerp`, `step`.

---

## 4. Faire un nouvel épisode (marche à suivre)

1. **Lire le PDF** (`episodes_pdf/NN_….txt`) et créer `<ep>/lignes.json` (voir le script Python utilisé dans l'historique
   git, ou copier un `lignes.json` existant). Regrouper les 30 plans en ~16 scènes : 1-2 salon, 3 plongée dans la télé,
   4-13 télé (avec le renard et le mouton en couleur quand ils parlent), 14 retour au salon, 15 salon, 16 logo.
2. **Voix** : copier `voix/refs/` d'un épisode récent, puis
   `sh outils_commun/voix_episodes.sh <ep>` (prises + choix + nettoyage + accélération). Vérifier `travail/choix_voix.txt`
   (score < 0,9 = à écouter ; refaire avec `GRAINES=1933,1934,1935,1936 python prises.py <ep> <id>` puis
   `choix_prises.py <ep> <id>`).
3. **Décors et scènes** : `anim_code/<ep>/commun.js` (copier celui d'`urgence`, garder `VIVANT_AUTO`, `CAM_COUPES`,
   `CAM_CALME`), `tv.js` (le monde N&B), `scene01.js`… `scene16.js`. Aperçu d'une image :
   `cd anim_code && HD=2 DESSIN=1 STYLE=1 node rendu_scene.js <ep> 05 --images 2.5` (image dans `anim_code/travail/`).
   **Montrer des aperçus à l'auteur avant de lancer un rendu complet.**
4. **Montage** : copier `<ep>/outils/montage.py` d'un épisode récent (titre, sous-titre, nom, badge, scènes TV),
   écrire `<ep>/sortie/<NOM>_publications.txt` (modèle : `urgence/sortie/…_publications.txt`).
5. **Tout fabriquer** : `sh outils_commun/episode.sh <ep> <NOM> "ÉPISODE NN" "TITRE" "« sous-titre »" "accroche story"`
   → `<ep>/sortie/<NOM>.zip`.
6. Vérifier quelques images de la vidéo finale (visages non cachés, textes lisibles), puis livrer le zip.

---

## 5. Fabriquer les vidéos directement sur GitHub (GitHub Actions)

Le dépôt contient `.github/workflows/episode.yml` : un serveur de GitHub installe tout et fabrique l'épisode, sans ordinateur.
1. Onglet **Actions** du dépôt → **Fabriquer un épisode** → **Run workflow**.
2. Choisir la branche `claude/wonderful-sagan-3cr70a`, remplir : dossier (`bacon`), nom de sortie (`EP11_Le_mythe_du_bacon`),
   badge, titre, sous-titre, accroche, et l'étape : `voix`, `video` ou `tout`.
3. **voix** génère les voix et les enregistre dans la branche (`<ep>/voix/*.mp3`) ; **video** rend les 16 scènes en HD, monte, fait
   la story et le zip. À la fin, le zip se télécharge en bas de la page de l'exécution, rubrique **Artifacts**.

À savoir :
- Le bouton « Run workflow » n'apparaît que si le fichier du workflow existe aussi sur la branche par défaut (`main`) :
  fusionner la branche dans `main` (ou au moins y copier `.github/workflows/episode.yml`).
- Les voix sont longues sur les serveurs gratuits (plusieurs heures, limite de 6 h par étape) : lancer d'abord `voix`, puis `video`.
- Dépôt privé : GitHub offre un quota de minutes gratuites par mois ; un épisode complet en consomme une bonne partie.
- ChatGPT (avec le connecteur GitHub) peut écrire les fichiers d'un nouvel épisode dans la branche ; la fabrication se lance ensuite
  depuis l'onglet Actions (ou par ChatGPT s'il a la permission de lancer les workflows).

## 6. Installer l'environnement (sur un ordinateur ou un serveur)

Le rendu et les voix demandent une vraie machine (Linux ou macOS ; 4 cœurs ou plus ; ~10 Go libres). Le bac à sable
de ChatGPT peut lire et modifier le code, mais ne peut généralement pas lancer Chromium ni les modèles de voix : dans ce
cas, ChatGPT prépare les fichiers et l'auteur lance les commandes chez lui.

```sh
# outils système
sudo apt install -y ffmpeg nodejs npm python3 python3-venv
# rendu (Chromium piloté par Playwright)
npm install -g playwright && npx playwright install chromium
# outils Python du montage et de la vérification des voix
pip install pillow numpy scipy noisereduce faster-whisper
# voix : Chatterbox multilingue, dans un environnement séparé
python3 -m venv ~/venvs/cb && ~/venvs/cb/bin/pip install chatterbox-tts torch torchaudio
```
Plus simple : `sh outils_commun/installer.sh` installe tout (Ubuntu). Les scripts `episode.sh` et `voix_episodes.sh` trouvent seuls
la racine du dépôt ; indiquer le Python des voix avec `export CB_PY=<chemin>/.venv-voix/bin/python` et mettre
`.venv-outils/bin` en tête du `PATH`.

---

## 7. Message à coller dans ChatGPT pour démarrer

> Tu reprends la production de ma série de dessins animés « Ne suis pas les moutons ». Tout est dans mon dépôt GitHub
> `senhajiyoussef1990-cloud/malik-`, branche `claude/wonderful-sagan-3cr70a`. Commence par lire `GUIDE_CHATGPT.md`
> en entier, puis les fichiers qu'il cite. Respecte strictement les règles artistiques de la section 2 et le texte des
> PDF mot pour mot. Montre-moi toujours des images d'aperçu avant de lancer un rendu complet. Parle-moi en français.
