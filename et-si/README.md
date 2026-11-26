# Et si ?

Shorts verticaux 1080×1920 : une question « Et si … ? » dès la première seconde, 10 scènes, outro « prochain épisode + abonne-toi ».

- `scenarios/` — textes, visuels, sources et métadonnées YouTube (saison 1, EP01–EP10).
- `episodes/epNN/anim.html` — animation de l'épisode (canvas, palette bleu nuit / orange).
- `moteur/voix.py` — voix edge-tts (par défaut `fr-FR-RemyMultilingualNeural`), durées réelles, sous-titres calés mot par mot → `timing.json`.
- `moteur/render.py` — rendu des scènes (Playwright + ffmpeg).
- `moteur/audio.py` + `moteur/assembler.py` — musique/bruitages, voix au premier plan, MP4 final (≈ -14 LUFS).

**Produire un épisode** : chaque push sur `et-si` qui touche `et-si/**` lance le workflow « Et si ? — épisode avec voix ». Le MP4 est dans l'onglet Actions → l'exécution → *Artifacts* → `et-si-epNN`.
Pour changer de voix ou de débit : modifier les valeurs par défaut `VOIX` / `DEBIT` dans `.github/workflows/et-si-episode.yml`.

Test hors ligne (voix simulée, silencieuse) : `python moteur/voix.py --ep 1 --out /tmp/ep01 --simulate`.

Contrôle humain obligatoire avant toute publication.
