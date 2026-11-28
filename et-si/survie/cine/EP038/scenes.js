['étouffés','baisse','sifflements','vertiges','bouchée','définitives'].forEach(w=>RED_W.add(w));
['consulte','ORL','urgence','urgences','précoce'].forEach(w=>GREEN_W.add(w));
function chambre(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'chambre',T);return [B,b];}
const AMB=b=>ambiance(b,[LAMPE(760,500,1.2),{x:1200,y:600,r:900,c:'rgba(200,220,255,0.5)'}],'#6a6e7a');
function sourd(b,T,x,y,u,k){const O=[x+0.6*u,y-0.5*u];acteur(b,'heros',x,y,u,{lean:0.03,look:0.8,tilt:-0.15*k,ex:{eye:0.9,brow:0.7*k,mouth:0.15*k},near:k>0.3?{to:O,hand:'open',ang:-2.2}:{},far:{bend:-1}});return O;}
function ondes(c,x,y,a,T,etouffe){if(a<=0)return;c.save();for(let i=0;i<3;i++){const ph=(T*0.9+i/3)%1;c.globalAlpha=a*(1-ph)*(etouffe?0.35:1);c.strokeStyle=etouffe?'rgba(150,150,160,1)':'rgba(255,210,120,1)';c.lineWidth=etouffe?4:7;c.setLineDash(etouffe?[8,10]:[]);c.beginPath();c.arc(x,y,40+ph*200,-0.9,0.9);c.stroke();}c.restore();}
const SCENES=[
(c,t,d)=>{const [B,b]=chambre(t);const k=ease(seg(t,0.3,1.0));const O=sourd(b,t,780,1000,190,k);AMB(b);const cam=camAt(t,d,{x:760,y:960,z:1.05},{x:780,y:960,z:1.15});accroche(c,t,d,B,cam,['tu perdais soudainement','l’audition ?']);c.save();camXf(c,cam);ondes(c,O[0]+300,O[1]+60,1,t,k>0.5);c.restore();},
(c,t,d)=>{const [B,b]=chambre(t);const O=sourd(b,t,780,1000,190,1);AMB(b);const cam={x:760,y:960,z:1.35};show(c,B,cam);grade(c,t);c.save();camXf(c,cam);ondes(c,O[0]+300,O[1]+60,1,t,t>C('etouffes',2.0)-0.3);c.restore();
  tag(c,'AU RÉVEIL',T1,clamp((t-0.2)/0.3),'sombre',42);tag(c,'LES SONS SEMBLENT ÉTOUFFÉS D’UN CÔTÉ',T2,clamp((t-C('etouffes',2.0))/0.3),'rouge',34);},
(c,t,d)=>planche(c,t,t,[['oreille','',C('oreille',1.6)-0.3,'une oreille'],['oreilleBouchee','',C('deux',2.6)-0.3,'ou les deux']],{kicker:'UNE BAISSE RAPIDE DE L’AUDITION',y:860}),
(c,t,d)=>{planche(c,t,t,[['calendrier','',0.3,'moins de 24 heures']],{kicker:'ELLE PEUT APPARAÎTRE EN',y:820,s:1.8});},
(c,t,d)=>planche(c,t,t,[['sifflementO','',C('sifflements',0.4)-0.2,'sifflements'],['vertige','',C('vertiges',1.4)-0.2,'vertiges']],{kicker:'PARFOIS AVEC',y:860}),
(c,t,d)=>{planche(c,t,t,[['oreilleBouchee','',C('bouchee',2.2)-0.4,'oreille « bouchée »']],{kicker:'OU SIMPLEMENT',y:820,s:1.8});},
(c,t,d)=>{planche(c,t,t,[['sablier','non',0.3,'n’attends pas']],{kicker:'ÇA NE VA PAS FORCÉMENT REVENIR',y:820,s:1.8});tag(c,'N’ATTENDS PAS',1250,clamp((t-C('attends',0.4))/0.3),'rouge',46);},
(c,t,d)=>{planche(c,t,t,[['orl','oui',C('orl',1.2)-0.3,'spécialiste ORL']],{kicker:'CONSULTE',y:820,s:1.8});tag(c,'EN URGENCE',1250,clamp((t-C('urgence',1.8))/0.3),'vert',46);},
(c,t,d)=>{planche(c,t,t,[['hopital','oui',C('urgences',2.6)-0.3,'urgences']],{kicker:'PAS D’ORL DISPONIBLE VITE ?',y:820,s:1.8});tag(c,'RENDS-TOI AUX URGENCES',1250,clamp((t-C('urgences',2.6))/0.3),'vert',42);},
(c,t,d)=>{planche(c,t,t,[['horloge','oui',C('precoce',1.4)-0.3,'prise en charge précoce']],{kicker:'C’EST IMPORTANT',y:820,s:1.8});tag(c,'CERTAINES PERTES PEUVENT DEVENIR DÉFINITIVES',1250,clamp((t-C('definitives',4.4))/0.3),'rouge',30);},
(c,t,d)=>fin(c,t,d,[['Sons étouffés, oreille bouchée',PAL.rouge],['Sifflements, vertiges possibles',PAL.rouge],['N’attends pas : ORL en urgence',PAL.vert],['Sinon : urgences',PAL.vert]]),
];
