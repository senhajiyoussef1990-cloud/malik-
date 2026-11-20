#!/bin/sh
# voix 18-19 : Kaggle → dépôt, puis déclenche le rendu vidéo sur GitHub (étape voix sautée)
cd /home/user/malik-
sh outils_commun/kaggle/recup_voix.sh fabrique-voix-18-19-b ampoule martiens
for e in ampoule martiens; do [ "$(ls $e/voix/*.mp3 | wc -l)" -ge 30 ] || { echo "voix incomplètes pour $e"; exit 1; }; done
python3 - <<'PY'
import json, time
for e in ["ampoule", "martiens"]:
    p = f"lancer/{e}.json"; d = json.load(open(p)); d["lancement"] = time.strftime("%Y-%m-%d %H:%M"); json.dump(d, open(p, "w"), ensure_ascii=False, indent=1)
PY
git add ampoule/voix/*.mp3 martiens/voix/*.mp3 lancer/ampoule.json lancer/martiens.json .github/workflows/lancer.yml
git commit -q -m "EP18-19 : voix faites sur Kaggle ; rendu vidéo lancé sur GitHub

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KFtbtt8Ly1PqNgAqq29H2q"
for i in 1 2 3 4; do git push -q origin claude/wonderful-sagan-3cr70a && break; git fetch -q origin claude/wonderful-sagan-3cr70a && git merge -q --no-edit FETCH_HEAD; sleep 5; done
echo "GITHUB LANCE 18-19"
