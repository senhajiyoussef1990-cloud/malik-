#!/bin/sh
# File d'attente unique, un seul gros calcul à la fois (sinon le serveur 4 cœurs s'écroule) :
# voix d'un épisode (+ reprises des répliques ratées) puis son rendu, et ainsi de suite.
cd /home/user/malik-; K=fabrique-voix-22-41; LOG=travail_voix.log
BON_S14A=abonnement/voix/s14a.mp3
st() { python3 outils_commun/kaggle/kg.py status $K | python3 -c "import json,sys;print(json.load(sys.stdin).get('status'))"; }
faibles() { python3 - "$1" <<'P'
import sys,re
for l in open(f"{sys.argv[1]}/travail/choix.log"):
    p=l.split()
    if len(p)<3 or not re.match(r"s\d\d[a-z]$",p[0]): continue
    sc=float(p[1]); txt=l.split("|",1)[1] if "|" in l else ""
    if p[0] in ("s14a","s16a"): continue
    seuil=.45 if "mille" in txt else .86          # Whisper écrit les années en chiffres : faux négatif
    if sc<seuil: print(p[0])
P
}
tempo() { e=$1; shift; for f in "$@"; do w=$(python3 -c "import json;print(next(l['who'] for l in json.load(open('$e/lignes.json')) if l['id']=='$f'))"); [ "$w" = narr ] && continue
  ffmpeg -y -v error -i $e/voix/$f.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 $e/voix/$f.t.mp3 && mv $e/voix/$f.t.mp3 $e/voix/$f.mp3; done; }
reprises() { e=$1; refaits=""
  for G in 1941,1942,1943 1951,1952,1953; do bad=$(faibles $e | tr '\n' ' '); [ -z "$bad" ] && break
    echo "$(date +%H:%M) $e reprises ($G) : $bad"; refaits="$refaits $bad"
    GRAINES=$G HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e $bad >> $e/travail/prises.log 2>&1
    HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e > $e/travail/choix.log 2>&1; done
  echo "$refaits"; }
fini() { e=$1; cp outils_commun/phrase_finale.mp3 $e/voix/s16a.mp3; cp $BON_S14A $e/voix/s14a.mp3; echo "$(date +%H:%M) $e restent faibles : $(faibles $e | tr '\n' ' ')"; }
rendu() { e=$1; S=$e/specification.json; j() { python3 -c "import json;print(json.load(open('$S'))['$1'])"; }
  echo "$(date +%H:%M) rendu $e"; sh outils_commun/episode.sh $e "$(j nom)" "$(j badge)" "$(j titre)" "$(j sous)" "$(j accroche)"; echo "LIVRE3 $e" >> $LOG; echo "$(date +%H:%M) livré $e"; }
# A) épisodes déjà voisés dont il faut seulement reprendre quelques répliques
#    rarete : toutes les prises sont ici ; 37-41 (GitHub) : seules les reprises sont ici, on ne réaccélère que celles-là
HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py rarete > rarete/travail/choix.log 2>&1; reprises rarete > /dev/null
tempo rarete $(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('rarete/lignes.json'))))"); fini rarete; rendu rarete
for e in couveuses serrure filtres euphemisme overton; do mkdir -p $e/travail
  cp $e/sortie/verification_voix.txt $e/travail/choix.log; r=$(reprises $e | tail -1); tempo $e $r; fini $e; rendu $e; done
# B) les autres, de zéro
for e in file claque rires asch foule bouc ennemi astroturf avis blouse dentistes sucre doute milgram; do
  s=$(st); if [ "$s" = "running" ] || [ "$s" = "complete" ]; then echo "$(date +%H:%M) Kaggle $s"; fi
  ids=$(python3 -c "import json;print(' '.join(l['id'] for l in json.load(open('$e/lignes.json')) if l['id'] not in ('s14a','s16a')))")
  echo "$(date +%H:%M) voix $e"
  HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e $ids >> $e/travail/prises.log 2>&1
  HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e > $e/travail/choix.log 2>&1; reprises $e > /dev/null
  tempo $e $ids; fini $e; rendu $e
done
echo "$(date +%H:%M) TOUT FINI"
