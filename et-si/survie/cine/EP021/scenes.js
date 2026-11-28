['profonds','beaucoup','visage','cou','profonde','main','articulation','rougeur','gonflement','fièvre','tétanos','rage'].forEach(w=>RED_W.add(w));
['lave','savon','rince','sèche','protège','pansement','pression','112','consulte','note','identifie'].forEach(w=>GREEN_W.add(w));
function jardin(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'jardin',T);return [B,b];}
const SOLEIL=b=>ambiance(b,[{x:1300,y:200,r:1800,c:'rgba(255,240,210,0.65)'}],'#c4c4c8');
function chien(b,x,y,s,T,aboie=0){b.save();b.translate(x,y);b.scale(-s,s);b.rotate(aboie*0.05*Math.sin(T*14));ICO.chien(b);b.restore();}
// blessé qui tient sa main mordue contre lui
function blesse(b,T,x,y,u,k=1,o={}){return acteur(b,'heros',x,y,u,{lean:0.04*k,look:o.look??0.7,ex:o.ex||{eye:lerp(0.6,1,k),brow:0.9*k,mouth:0.5*k},near:o.near||{to:[x+0.75*u,y+1.05*u],hand:'open',ang:-2.2},far:o.far||{to:[x+0.6*u,y+1.15*u],hand:'grip',bend:-1},walk:o.walk});}
function sdb(T,eau){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'sdb',T,{eau,eauY:1030});return [B,b];}
const LAMPE_SDB=b=>ambiance(b,[LAMPE(760,300,1.1),LAMPE(500,1000,0.5,900)],'#6a6e74');
const SCENES=[
(c,t,d)=>{const [B,b]=jardin(t);const k=ease(seg(t,0.2,0.9));chien(b,1080,1480,1.5,t,1-k);blesse(b,t,560,900,190,k);SOLEIL(b);
  accroche(c,t,d,B,camAt(t,d,{x:800,y:1150,z:1.0},{x:780,y:1100,z:1.15}),['un chien','te mordait ?']);},
(c,t,d)=>{planche(c,t,t,[['chien','',0.2,'une petite morsure…'],['tendon','',C('profonds',2.2)-0.2,'tissus profonds']],{kicker:'NE TE FIE PAS À LA TAILLE',y:860});tag(c,'ELLE PEUT ALLER EN PROFONDEUR',1250,clamp((t-C('profonds',2.2))/0.3),'rouge',38);},
(c,t,d)=>{const [B,b]=sdb(t,t>C('lave',1.4)-0.5);acteur(b,'heros',420,760,200,{lean:0.12,look:0.9,ex:{eye:0.8,brow:0.4,mouth:0.1},near:{to:[820,1040],hand:'open',ang:0.6},far:{to:[790,1060],hand:'open',bend:-1}});LAMPE_SDB(b);
  show(c,B,{x:700,y:1000,z:1.2});grade(c,t);tag(c,'PLAIE QUI SAIGNE PEU',T1,clamp((t-0.1)/0.3),'sombre',40);tag(c,'EAU + SAVON, RAPIDEMENT',T2,clamp((t-C('savon',2.4))/0.3),'vert',40);},
(c,t,d)=>planche(c,t,t,[['robinet','oui',C('rince',0.2)-0.1,'rince'],['linge','oui',C('seche',1.6)-0.2,'sèche'],['pansement','oui',C('protege',2.4)-0.2,'pansement stérile']],{kicker:'ENSUITE',cols:3,s:0.95,y:880}),
(c,t,d)=>{const [B,b]=jardin(t);const x=640,y=880,u=200,P=[x+0.7*u,y+1.2*u];blesse(b,t,x,y,u,1,{ex:{eye:0.9,brow:0.8,mouth:0.3},near:{to:[P[0]+0.08*u,P[1]-0.1*u],hand:'grip',ang:-1.6},far:{to:P,hand:'open',bend:-1}});
  b.save();b.translate(P[0]+0.05*u,P[1]-0.02*u);b.scale(0.55,0.55);ICO.linge(b);b.restore();SOLEIL(b);show(c,B,{x:740,y:1120,z:1.25});grade(c,t);
  tag(c,'ÇA SAIGNE BEAUCOUP ?',T1,clamp((t-C('beaucoup',0.8))/0.3),'rouge',42);tag(c,'APPUIE AVEC UN LINGE PROPRE',T2,clamp((t-C('pression',2.0))/0.3),'vert',38);tag(c,'APPELLE LE 112',1250,clamp((t-C('appelle',3.6))/0.3),'vert',46);},
(c,t,d)=>{darkBg(c);kicker(c,'MORSURE AU VISAGE OU AU COU',300,1);const r='rgba(229,57,53,0.95)';corps(c,W/2,980,0.75,{tete:clamp((t-C('visage',1.2)+0.2)/0.3)>0?r:undefined,cou:clamp((t-C('cou',1.8)+0.2)/0.3)>0?r:undefined});
  tag(c,'AIDE URGENTE : 112',420,clamp((t-C('cou',1.8))/0.3),'vert',46);grade(c,t,{vig:0.5});},
(c,t,d)=>{darkBg(c);kicker(c,'CONSULTE RAPIDEMENT',300,1);const r='rgba(229,57,53,0.95)';corps(c,W/2,1000,0.75,{mains:clamp((t-C('main',2.0)+0.2)/0.3)>0?r:undefined,brasG:clamp((t-C('articulation',3.0)+0.2)/0.3)>0?'rgba(229,57,53,0.5)':undefined,brasD:clamp((t-C('articulation',3.0)+0.2)/0.3)>0?'rgba(229,57,53,0.5)':undefined});
  tag(c,'MORSURE PROFONDE',400,clamp((t-C('consulte',0.2))/0.3),'rouge',40);tag(c,'À LA MAIN',490,clamp((t-C('main',2.0))/0.3),'rouge',40);tag(c,'PRÈS D’UNE ARTICULATION',580,clamp((t-C('articulation',3.0))/0.3),'rouge',40);grade(c,t,{vig:0.5});},
(c,t,d)=>planche(c,t,t,[['vaccin','',C('tetanos',1.6)-0.3,'tétanos'],['rage','',C('rage',2.6)-0.3,'rage']],{kicker:'LE MÉDECIN ÉVALUERA LES RISQUES',y:860}),
(c,t,d)=>planche(c,t,t,[['notice','oui',C('note',1.0)-0.2,'note les circonstances'],['chien','oui',C('identifie',2.0)-0.2,'identifie l’animal']],{kicker:'SI POSSIBLE',y:860})||tag(c,'SANS TE METTRE EN DANGER',1250,clamp((t-C('identifie',2.0)-1.0)/0.3),'jaune',38),
(c,t,d)=>{planche(c,t,t,[['infection','',C('rougeur',0.6)-0.2,'rougeur, gonflement'],['thermo','',C('fievre',2.2)-0.2,'fièvre']],{kicker:'LES JOURS SUIVANTS',y:860});tag(c,'DEMANDE UN AVIS MÉDICAL',1250,clamp((t-C('fievre',2.2)-0.4)/0.3),'vert',40);},
(c,t,d)=>fin(c,t,d,[['Eau et savon, puis pansement stérile',PAL.vert],['Saigne beaucoup : appuie et 112',PAL.vert],['Visage, cou : aide urgente',PAL.rouge],['Profonde, main, articulation : consulte',PAL.rouge]]),
];
