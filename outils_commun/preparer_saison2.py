"""Préparation des sources EP51-90 à partir des modèles du dépôt.
Ne génère ni voix ni MP4 ; vérifier les aperçus avant la fabrication complète.
Usage: python3 outils_commun/preparer_saison2.py [51 ... 90]
"""
from pathlib import Path
import sys, json, re, shutil, shlex, subprocess
R=Path(__file__).resolve().parents[1]
A=R/'anim_code'
CFG=[
 ('FÊTE FORAINE','drawers',['UN TIROIR','SURPRISE','ENCORE ?','PAS DE FIN'],['VIDÉOS','ENCORE UNE','10 MIN','PAUSE']),
 ('PLACE DU VILLAGE','bell',['LES NOUVELLES','DING !','UNE VITRINE','DING !'],['27 ALERTES','PROMOTIONS','MESSAGES','ALERTES OFF']),
 ('THÉÂTRE','stage',['LE CONTE','LA SUITE','SANS PAUSE','ENCORE'],['ÉPISODE 1','SUIVANT','LECTURE AUTO','DÉSACTIVÉE']),
 ('BOULANGERIE','stamps',['1 TAMPON','10 TAMPONS','30 TAMPONS','REMISE À ZÉRO'],['60 JOURS','FLAMME','REPOS','OBJECTIF']),
 ('CHÂTEAU','doors',['BIENVENUE','REGISTRE','AUTRE PORTE','CHOIX'],['TOUT ACCEPTER','OPTIONS','REFUSER','VALIDER']),
 ('AUBERGE','maze',['ENTREZ','COULOIR','FORMULAIRES','SORTIE ?'],['S’ABONNER','RENOUVELLEMENT','RÉSILIER','CONFIRMATION']),
 ('AUBERGE','bill',['REPAS 10 F','FRAIS','ADDITION','TOTAL'],['BILLET 20 €','FRAIS 15 €','TOTAL 35 €','COMPARER']),
 ('MARCHÉ','prices',['5 F','8 F','DEUX PRIX','COMPARER'],['15 €','22 €','MÊME OFFRE','COMPARER']),
 ('AUBERGE','queue',['DERNIÈRE CHAMBRE','12 VOYAGEURS ?','UNE CLÉ','FAUSSE FILE'],['12 PERSONNES','CHAMBRE','DATES','ANNULATION']),
 ('FOIRE','sale',['50 F','100 F','-50 %','REÇU : 50 F'],['100 €','-50 %','50 €','HISTORIQUE']),
]
ST={3:[0],4:[1,2],5:[3,4],6:[5,6],7:[7],8:[8,9],9:[10,11],10:[13,14],11:[15],12:[16,17],13:[18],14:[0]}
def js(x): return json.dumps(x,ensure_ascii=False)
def put(p,s):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(s,encoding='utf-8')
def prepare(n):
    ep=f's2_{n}'
    E=R/ep
    D=A/ep
    S=json.loads((E/'specification.json').read_text())
    V=json.loads((E/'direction.json').read_text())
    if n <= 60:
        place,kind,labels,modern=CFG[n-51]
    else:
        place,kind,labels,modern=V['place'].upper(),'objet',V['labels'],V['modern']
    for d in ['audio','fonts','voix/refs']:
        if not (E/d).exists(): shutil.copytree(R/'modele'/d,E/d)
    for d in ['outils','sortie','voix']: (E/d).mkdir(exist_ok=True,parents=True)
    shutil.copy2(R/'modele/outils/minutage.py',E/'outils/minutage.py')
    if not (E/'voix/s16a.mp3').exists(): shutil.copy2(R/'modele/voix/s16a.mp3',E/'voix/s16a.mp3')
    commun=(A/'modele/commun.js').read_text().replace('La mauvaise haleine',S['titre']).replace("c.fillText('2 ANS', 0, -90);",f'c.fillText({js(modern[0])}, 0, -90, 68);')
    put(D/'commun.js',commun)
    config=dict(numero=n,place=place,kind=kind,labels=labels,modern=modern)
    put(D/'tv.js',(A/'modele/tv.js').read_text()+'\nconst S2 = '+js(config)+';\n'+(R/'outils_commun/saison2_tv.js').read_text()+'\n'+(R/'outils_commun/saison2_objets.js').read_text())
    for k in range(1,17):
        name=f'scene{k:02d}.js'
        src=(A/'modele'/name).read_text()
        if k in ST:
            st=ST[k]
            def call(j): return f'((cc,t,u)=>s2Fable(cc,t,u,{st[j]},{js(f"s{k:02d}"+("b" if j else "a"))}))'
            if len(st)==2:
                src,count=re.subn(r'^const XA = .*$',f'const XA = {call(0)}, XB = {call(1)};',src,flags=re.M)
            else:
                src,count=re.subn(r'^const (XI|X) = .*$',lambda m:f'const {m[1]} = {call(0)};',src,flags=re.M)
            if count!=1: raise ValueError(f'{ep} {name}: modèle incompatible')
        if k==3: src=src.replace("'Amérique — années vingt'","'Fable — années 30'")
        if k==15:
            old=["il est cassé,","ou juste","plus à la","mode ?"]
            for a,b in zip(old,V['carnet']): src=src.replace("'"+a+"'",js(b))
        if 53 <= n <= 60 and k == 1:
            src = src.replace('objetCouleur(cc, a[0], a[1] + 110, .55, -.08)',
                              'ecranSalon(cc, a[0], a[1] + 54, .24, -.08, true)')
            src = src.replace('  c.restore();\n}', '''  c.restore();
  const finInsert = Math.min(B[0], 2.1);
  if (t < finInsert) {
    c.save();
    ecranSalon(c, W*.30, H*.52, 1.46, -.035, t > finInsert*.45);
    c.restore();
  }
}''')
        if 53 <= n <= 60 and k == 15:
            src = src.replace('  c.save(); cam(c,', '''  if (lb >= 0 && lc < 0) {
    const reaction = Math.sin(Math.PI * Math.min(1, lb / .85));
    M.tilt -= .11 * reaction; M.sourcil = .9 * reaction;
    M.handR = [124 + reaction * 36, -445 - reaction * 135];
    M.poseR = 'ouverte';
  }
  c.save(); cam(c,''')
        put(D/name,src)
    m=(R/'modele/outils/montage.py').read_text()
    m=re.sub(r'^TITRE, SOUS = .*$','TITRE, SOUS = '+js(S['titre'])+', '+js(S['sous']),m,flags=re.M)
    m=re.sub(r'^NOM = .*$','NOM = '+js(S['nom']),m,flags=re.M)
    m=m.replace('badge = "ÉPISODE 1"',f'badge = "ÉPISODE {n}"')
    m=m.replace('q = "« Répéter aide à mémoriser, pas à démontrer. »"','q = '+js('« '+V['moral']+' »'))
    m=re.sub(r'(NOMS = \{[\s\S]*?\}\n)',lambda a:a[0]+'NOMS.update('+repr(S['noms'])+')\n',m,count=1)
    compile(m,str(E/'outils/montage.py'),'exec')
    put(E/'outils/montage.py',m)
    cmd=' '.join(shlex.quote(S[k]) for k in ['ep','nom','badge','titre','sous','accroche'])
    put(R/f'outils_commun/fin_{ep}.sh','#!/bin/sh\nset -eu\ncd "$(dirname "$0")/.."\nsh outils_commun/episode.sh '+cmd+'\n')
    # Contrôle syntaxique JS seulement : ne remplace pas la validation visuelle.
    if shutil.which('node'):
        for f in D.glob('*.js'): subprocess.run(['node','--check',str(f)],check=True)
    print(ep,'16 scènes préparées ; voix et aperçus à fabriquer')
if __name__=='__main__':
    for n in map(int,sys.argv[1:] or range(51,91)):
        if n not in range(51,91): raise SystemExit('Numéro attendu : 51 à 90')
        prepare(n)

