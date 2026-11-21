#!/bin/sh
# Kaggle (compte papisrieux) fait les voix 23-36 ; ici : arrêter la file locale avant sa partie B, récupérer, reprendre les ratées sur GPU, rendre un par un.
cd /home/user/malik-; K=fabrique-voix-23-36; EPS="file claque rires asch foule bouc ennemi astroturf avis blouse dentistes sucre doute milgram"; O=/tmp/claude-0/kaggle_$K
# 1) la file locale v3 s'arrête dès qu'elle attaque la partie B
until grep -q "voix file" travail_voix_local.log; do sleep 30; done; pkill -f voix_local_v3.sh; pkill -f "prises.py file"; echo "$(date +%H:%M) file locale arrêtée (partie B confiée à Kaggle)"
# 2) attendre Kaggle
while :; do S=$(python3 outils_commun/kaggle/kg.py status $K | python3 -c "import json,sys;print(json.load(sys.stdin).get('status',''))"); case "$S" in complete|error|cancel*) break;; esac; sleep 120; done
echo "$(date +%H:%M) Kaggle $S"; mkdir -p $O && python3 outils_commun/kaggle/kg.py output $K $O
for e in $EPS; do [ -f $O/voix_$e.zip ] && unzip -o -q $O/voix_$e.zip -d .; done
# 3) reprises des ratées sur GPU (un 2e carnet, graines nouvelles)
python3 - $EPS <<'P' > /tmp/claude-0/reprises23.json
import json,sys,re
d={}
for e in sys.argv[1:]:
    try: L=open(f"{e}/travail/choix_voix.txt").read().splitlines()
    except: continue
    for l in L:
        p=l.split()
        if len(p)<3 or not re.match(r"s\d\d[a-z]$",p[0]) or p[0] in ("s14a","s16a"): continue
        if float(p[1]) < (.45 if "mille" in l else .86): d.setdefault(e,[]).append(p[0])
print(json.dumps(d))
P
cat /tmp/claude-0/reprises23.json
if [ "$(cat /tmp/claude-0/reprises23.json)" != "{}" ]; then
  for e in $EPS; do cp $e/travail/choix_voix.txt $e/travail/choix_voix_1.txt 2>/dev/null; done
  D=/tmp/claude-0/paquet14; rm -rf $D; mkdir -p $D/outils_commun; cp outils_commun/prises.py outils_commun/choix_prises.py outils_commun/nettoie_voix.py $D/outils_commun/ 2>/dev/null; cp /tmp/claude-0/reprises23.json $D/episodes.json
  for e in $EPS; do mkdir -p $D/$e/voix; cp $e/lignes.json $D/$e/; cp -r $e/voix/refs $D/$e/voix/; done
  (cd $D && rm -f ../paquet14.zip && zip -q -r ../paquet14.zip .); python3 outils_commun/kaggle/kg.py dataset paquet-voix-14 /tmp/claude-0/paquet14.zip; sleep 90
  python3 outils_commun/kaggle/kg.py push reprises-voix-23-36 outils_commun/kaggle/voix_kaggle_reprises.py papisrieux/paquet-voix-14
  while :; do S=$(python3 outils_commun/kaggle/kg.py status reprises-voix-23-36 | python3 -c "import json,sys;print(json.load(sys.stdin).get('status',''))"); case "$S" in complete|error|cancel*) break;; esac; sleep 60; done
  O2=/tmp/claude-0/kaggle_reprises23; mkdir -p $O2 && python3 outils_commun/kaggle/kg.py output reprises-voix-23-36 $O2
  for e in $EPS; do [ -f $O2/voix_$e.zip ] && unzip -o -q $O2/voix_$e.zip -d .; done; echo "$(date +%H:%M) reprises GPU $S"
fi
# 4) attendre que la file locale ait fini ses rendus (EP22, 37-41), puis rendre 23-36 un par un
until grep -q "LIVRE3 overton" travail_voix.log; do sleep 60; done
for e in $EPS; do cp outils_commun/phrase_finale.mp3 $e/voix/s16a.mp3; cp abonnement/voix/s14a.mp3 $e/voix/s14a.mp3
  S=$e/specification.json; j() { python3 -c "import json;print(json.load(open('$S'))['$1'])"; }
  echo "$(date +%H:%M) rendu $e"; sh outils_commun/episode.sh $e "$(j nom)" "$(j badge)" "$(j titre)" "$(j sous)" "$(j accroche)"; echo "LIVRE3 $e" >> travail_voix.log; echo "$(date +%H:%M) livré $e"; done
echo "$(date +%H:%M) TOUT FINI"
