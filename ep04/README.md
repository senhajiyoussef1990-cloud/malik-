# NE SUIS PAS LES MOUTONS — Épisode 04 : TOUT LE MONDE LE FAIT !

*(et personne ne sait pourquoi)* · 1080 × 1920 · 30 i/s · 2 min 45 s

## Livrables (`sortie/`)
| Fichier | Contenu |
|---|---|
| `EP04_Tout_le_monde_le_fait.mp4` | Épisode final, sous-titres incrustés |
| `EP04_sans_sous_titres.mp4` | Même montage, sans sous-titres |
| `EP04_Tout_le_monde_le_fait.srt` | Sous-titres synchronisés |
| `EP04_script_voix.md` | Script complet, locuteur et minutage de chaque réplique |
| `EP04_couverture.png` | Couverture 9:16 |
| `EP04_bande_annonce.mp4` | Bande-annonce (≈ 39 s : accroche + dernier piège) |

## Dossier du projet
| Dossier / fichier | Rôle |
|---|---|
| `images/` | Les 15 images de scène fournies |
| `lignes.json` | Les 30 répliques du scénario (scène, locuteur, pause comique) |
| `scenes.json` | Éléments détourés par scène (boîtes) |
| `voix/refs/` | Voix de référence (narrateur = voix de l'utilisateur) |
| `voix/*.mp3` | Répliques générées et nettoyées |
| `audio/` | Musique ragtime et bruitages (régénérables : `outils/sons.py`) |
| `outils/` | Chaîne de production (voir ci-dessous) |
| `travail/` | Fichiers intermédiaires (masques, fonds reconstitués, bande vidéo, mixage) |

## Refaire l'épisode
```sh
/root/venvs/cb/bin/python outils/voix.py      # voix (Chatterbox, CPU) — garde celles déjà faites
/root/venvs/sd/bin/python outils/detoure.py   # détourage des personnages (SAM)
python3 outils/sons.py 170                    # musique + bruitages
python3 outils/minutage.py                    # minutage mot à mot (faster-whisper)
python3 outils/anime.py --tout                # animation des 15 scènes (4 cœurs)
python3 outils/montage.py                     # montage + tous les livrables
```
Pour régénérer une réplique : supprimer `voix/<id>.wav`, puis `SEED=1931 … outils/voix.py <id>`.

## Choix de réalisation
- Boutique **en couleur** (renard, mouton) et dessin animé **noir et blanc** dans le téléviseur (humains uniquement) — jamais mélangés.
- Animation en code : personnages détourés qui rebondissent sur le tempo (128 BPM), écrasement/étirement, mouvement « sur 2 », caméra qui cadre le personnage qui parle, effets par scène, plongée dans le téléviseur (scène 3) et sortie (scène 13), arrêt sur image + iris (scène 15).
- Style rubber hose inspiré des paramètres publiés par *huashu-art-motion* (MIT).
- Aucun logo tiers ; filigrane « © Ne suis pas les moutons ».
