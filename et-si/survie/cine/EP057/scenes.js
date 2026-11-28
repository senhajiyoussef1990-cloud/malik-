['problème'].forEach(w=>RED_W.add(w));
['vérifié','sécurité','usure','pression','constructeur','réglage','contrôle','entretien'].forEach(w=>GREEN_W.add(w));
function allee(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'jardin',T,{fleurs:false});b.fillStyle='#8a8e94';b.fillRect(0,1500,WB,420);voiture(b,820,1460,1.1,'#3c8fd0',{});
  for(const [x,y,w,h,col] of [[1180,1480,110,90,'#8a5a3a'],[1300,1450,80,120,'#3a6ab0']]){b.fillStyle=col;b.beginPath();b.roundRect(x,y,w,h,10);b.fill();}return [B,b];}
const JOUR=b=>ambiance(b,[{x:1200,y:200,r:1900,c:'rgba(255,240,210,0.55)'}],'#c8c8cc');
const SCENES=[
(c,t,d)=>{const [B,b]=allee(t);acteur(b,'heros',420,1250,70,{look:0.9,ex:{eye:0.8,brow:0.4,mouth:0.2}});JOUR(b);accroche(c,t,d,B,camAt(t,d,{x:760,y:1200,z:1.1},{x:680,y:1340,z:1.5}),['tes pneus','étaient mal gonflés ?']);},
(c,t,d)=>{const [B,b]=allee(t);JOUR(b);show(c,B,{x:640,y:1480,z:2.0});grade(c,t);tag(c,'VOITURE CHARGÉE POUR LES VACANCES',T1,clamp((t-0.2)/0.3),'sombre',34);tag(c,'TES PNEUS, VÉRIFIÉS ?',T2,clamp((t-C('pneus',2.6))/0.3),'jaune',42);},
(c,t,d)=>{planche(c,t,t,[['pneu','oui',0.3,'pneus entretenus']],{kicker:'C’EST DE LA SÉCURITÉ',y:820,s:1.8});},
(c,t,d)=>planche(c,t,t,[['pneu','oui',0.2,'état'],['loupe','oui',C('usure',1.6)-0.3,'usure']],{kicker:'VÉRIFIE RÉGULIÈREMENT',y:860}),
(c,t,d)=>planche(c,t,t,[['notice','oui',C('constructeur',1.8)-0.3,'recommandations'],['manometre','oui',C('pression',3.0)-0.3,'pression adaptée']],{kicker:'DU CONSTRUCTEUR',y:860}),
(c,t,d)=>{planche(c,t,t,[['bagages','',0.2,'voiture chargée'],['manometre','oui',C('reglage',2.2)-0.3,'autre réglage']],{kicker:'CHARGEMENT IMPORTANT',y:860});},
(c,t,d)=>{planche(c,t,t,[['calendrier','oui',C('controle',0.2)-0.1,'avant un long trajet']],{kicker:'CONTRÔLE',y:820,s:1.8});},
(c,t,d)=>planche(c,t,t,[['planEcrit','oui',C('entretien',0.8)-0.2,'entretien régulier'],['detresse','non',2.6,'panne sur la route']],{kicker:'MIEUX VAUT',y:860}),
(c,t,d)=>fin(c,t,d,[['Vérifie état et usure des pneus',PAL.vert],['Pression du constructeur',PAL.vert],['Chargé : réglage adapté',PAL.vert],['Contrôle avant chaque long trajet',PAL.vert]]),
];
