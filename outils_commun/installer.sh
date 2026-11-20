#!/bin/sh
# Installe tout ce qu'il faut pour fabriquer les épisodes sur une machine Ubuntu (ordinateur, serveur ou GitHub Actions).
# usage : sh outils_commun/installer.sh        (à lancer depuis la racine du dépôt ; sudo demandé pour apt)
set -e
RACINE=$(cd "$(dirname "$0")/.." && pwd)
SUDO=$(command -v sudo >/dev/null 2>&1 && [ "$(id -u)" != 0 ] && echo sudo || true)
$SUDO apt-get update
$SUDO apt-get install -y ffmpeg zip python3-venv python3-pip fonts-dejavu fonts-liberation
# rendu : Playwright + Chromium
cd "$RACINE/anim_code" && npm install --no-audit --no-fund && npx playwright install --with-deps chromium
# outils Python (minutage, choix des prises, nettoyage, montage, story)
python3 -m venv "$RACINE/.venv-outils"
"$RACINE/.venv-outils/bin/pip" install -q faster-whisper==1.2.1 noisereduce==3.0.3 pillow numpy scipy
# voix : Chatterbox multilingue (CPU)
python3 -m venv "$RACINE/.venv-voix"
"$RACINE/.venv-voix/bin/pip" install -q torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu
"$RACINE/.venv-voix/bin/pip" install -q chatterbox-tts==0.1.7
echo "Installation terminée."
echo "Avant de lancer les scripts :  export PATH=\"$RACINE/.venv-outils/bin:\$PATH\" CB_PY=\"$RACINE/.venv-voix/bin/python\""
