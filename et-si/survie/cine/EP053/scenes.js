['dangereux','choc','gênent'].forEach(w=>RED_W.add(w));
['répartis','lourds','fabricant','pression','pneus','feux','essuie-glaces','sécurité'].forEach(w=>GREEN_W.add(w));
function allee(T,k=1){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'jardin',T,{fleurs:false});b.fillStyle='#8a8e94';b.fillRect(0,1500,WB,420);voiture(b,820,1460,1.1,'#3c8fd0',{});
  for(const [x,y,w,h,col] of [[1180,1480,110,90,'#8a5a3a'],[1300,1450,80,120,'#3a6ab0'],[1220,1400,70,60,'#c84a3a']]){b.fillStyle=col;b.beginPath();b.roundRect(x,y,w,h,10);b.fill();}return [B,b];}
const JOUR=b=>ambiance(b,[{x:1200,y:200,r:1900,c:'rgba(255,240,210,0.55)'}],'#c8c8cc');
const SCENES=[
(c,t,d)=>{const [B,b]=allee(t);acteur(b,'heros',1080,1250,70,{look:0.2,ex:{eye:0.8,brow:0.3,mouth:0.2},near:{to:[1080-0.9*70,1250+1.2*70],hand:'grip'},far:{bend:-1}},{mirror:true});b.fillStyle='#8a5a3a';b.beginPath();b.roundRect(1080-1.5*70,1250+1.15*70,60,46,8);b.fill();JOUR(b);
  accroche(c,t,d,B,camAt(t,d,{x:900,y:1200,z:1.1},{x:920,y:1260,z:1.25}),['tes bagages','devenaient dangereux','lors d’un freinage ?']);},
(c,t,d)=>{const [B,b]=allee(t);JOUR(b);show(c,B,{x:900,y:1300,z:1.15});grade(c,t);tag(c,'DÉPART EN VACANCES',T1,clamp((t-0.2)/0.3),'sombre',42);tag(c,'VOITURE PLEINE DE BAGAGES',T2,clamp((t-C('bagages',2.4))/0.3),'jaune',38);},
(c,t,d)=>{planche(c,t,t,[['plageArriere','non',0.3,'objets sur la plage arrière']],{kicker:'ATTENTION',y:820,s:1.8});tag(c,'PROJECTILES EN CAS DE CHOC',1250,clamp((t-C('choc',2.4))/0.3),'rouge',40);},
(c,t,d)=>planche(c,t,t,[['plageArriere','non',0.2,'plage arrière vide'],['oeil','',C('visibilite',2.0)-0.3,'visibilité gênée']],{kicker:'ÉVITE AUSSI',y:860}),
(c,t,d)=>planche(c,t,t,[['bagages','oui',C('repartis',0.2)-0.1,'charge répartie'],['bagages','oui',C('lourds',2.4)-0.3,'le plus lourd en bas']],{kicker:'DANS LE COFFRE',y:860}),
(c,t,d)=>{planche(c,t,t,[['coffreToit','oui',0.3,'coffre de toit']],{kicker:'RESPECTE LES INDICATIONS DU FABRICANT',y:820,s:1.8});},
(c,t,d)=>planche(c,t,t,[['veloArriere','oui',C('velos',1.0)-0.2,'porte-vélos'],['voiture','oui',1.6,'remorque']],{kicker:'MÊME RÈGLE POUR',y:860}),
(c,t,d)=>planche(c,t,t,[['manometre','oui',C('pneus',1.6)-0.3,'pression'],['pneu','oui',C('pneus',1.6)+0.4,'état des pneus']],{kicker:'AVANT DE PARTIR',y:860}),
(c,t,d)=>planche(c,t,t,[['essuieGlace','oui',C('feux',0.8)-0.2,'feux et essuie-glaces']],{kicker:'VÉRIFIE AUSSI',y:820,s:1.8}),
(c,t,d)=>{planche(c,t,t,[['planEcrit','oui',0.3,'voiture préparée']],{kicker:'UN VOYAGE SÛR',y:820,s:1.8});tag(c,'ÇA FAIT PARTIE DE LA SÉCURITÉ',1250,clamp((t-C('securite',2.6))/0.3),'vert',38);},
(c,t,d)=>fin(c,t,d,[['Rien sur la plage arrière',PAL.rouge],['Lourd en bas, charge répartie',PAL.vert],['Coffre de toit, vélos : notice',PAL.vert],['Pneus, feux, essuie-glaces vérifiés',PAL.vert]]),
];
