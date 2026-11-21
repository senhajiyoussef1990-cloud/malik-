#!/bin/sh
# Voix locales EP22-36 avec reprise automatique des répliques mal reconnues (score < 0.86).
cd /home/user/malik-; K=fabrique-voix-22-41
st() { python3 outils_commun/kaggle/kg.py status $K | python3 -c "import json,sys;print(json.load(sys.stdin).get('status'))"; }
reprises() { e=$1
  for G in 1941,1942,1943 1951,1952,1953; do
    bad=$(awk '$2<0.86 && $1!="s16a" {print $1}' $e/travail/choix.log | tr '\n' ' '); [ -z "$bad" ] && break
    echo "$(date +%H:%M) $e reprises ($G) : $bad"
    GRAINES=$G HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e $bad >> $e/travail/prises.log 2>&1
    HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e > $e/travail/choix.log 2>&1
  done
  cp outils_commun/phrase_finale.mp3 $e/voix/s16a.mp3
  for f in $(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('$e/lignes.json')) if l['who']!='narr'))"); do
    ffmpeg -y -v error -i $e/voix/$f.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 $e/voix/$f.t.mp3 && mv $e/voix/$f.t.mp3 $e/voix/$f.mp3; done
  echo "$(date +%H:%M) $e restent faibles :"; awk '$2<0.86' $e/travail/choix.log | cut -c1-160; }
# 1) rarete : reprises puis nouveau rendu
reprises rarete; (sh outils_commun/episode.sh rarete EP22_L_edition_limitee "ÉPISODE 22" "L’ÉDITION LIMITÉE" "$(python3 -c "import json;print(json.load(open('rarete/specification.json'))['sous'])")" "$(python3 -c "import json;print(json.load(open('rarete/specification.json'))['accroche'])")"; echo "REFAIT rarete" >> travail_voix.log) &
# 2) file : attendre la fin des prises en cours
while pgrep -f "prises.py file" > /dev/null; do sleep 20; done
HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py file > file/travail/choix.log 2>&1; reprises file; echo "VOIX file FIN" >> travail_voix.log
# 3) les suivants
for e in claque rires asch foule bouc ennemi astroturf avis blouse dentistes sucre doute milgram; do
  s=$(st); if [ "$s" = "running" ] || [ "$s" = "complete" ]; then echo "$(date +%H:%M) Kaggle $s : il prend la suite"; exit 0; fi
  ids=$(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('$e/lignes.json')) if l['id']!='s16a'))")
  echo "$(date +%H:%M) voix $e"
  HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e $ids > $e/travail/prises.log 2>&1
  HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e > $e/travail/choix.log 2>&1
  reprises $e; echo "VOIX $e FIN" >> travail_voix.log
done
