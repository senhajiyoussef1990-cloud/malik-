#!/bin/sh
# Télécharge les voix françaises Piper (trop lourdes pour git, environ 200 Mo).
# pip install piper-tts
cd "$(dirname "$0")/../voices" || exit 1
for v in gilles/low/fr_FR-gilles-low tom/medium/fr_FR-tom-medium upmc/medium/fr_FR-upmc-medium; do
  n=$(basename "$v")
  for ext in onnx onnx.json; do
    [ -f "$n.$ext" ] || curl -sSfL -o "$n.$ext" "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/fr/fr_FR/$v.$ext"
  done
done
