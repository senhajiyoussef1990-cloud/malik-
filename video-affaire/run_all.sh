#!/bin/sh
# Chaîne complète : images -> voix -> minutage -> montage
set -e
cd "$(dirname "$0")"
export HF_HUB_DISABLE_XET=1
python3 assets.py
python3 anim.py
/root/venvs/cb/bin/python voix.py
python3 minutage.py
python3 build.py
