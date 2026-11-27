['douleur','poitrine','bras','dos','mâchoire','sueurs','nausées','essoufflement','malaise','fatigue','banalise'].forEach(w=>RED_W.add(w));
['112','compose','décris','réponds','secours','rapide','soins'].forEach(w=>GREEN_W.add(w));
function salon(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'salon',T,{radiateur:false});return [B,b];}
const AMB=b=>ambiance(b,[LAMPE(760,500,1.1),LAMPE(300,600,0.5)],'#55555e');
// main sur la poitrine, visage crispé
function douleur(b,T,x,y,u,k,o={}){return acteur(b,'heros',x,y,u,{lean:0.06*k,look:0.6,ex:{eye:lerp(0.7,0.4,k),brow:0.9*k,mouth:0.3*k},near:{to:[x+0.55*u,y+0.95*u],hand:'open',ang:-2.6},far:o.far||{to:[x+0.2*u,y+2.1*u],bend:-1}});}
function pulse(c,x,y,a,T,col='rgba(229,57,53,'){if(a<=0)return;for(let i=0;i<3;i++){const ph=(T*1.4+i/3)%1;c.strokeStyle=col+(a*(1-ph))+')';c.lineWidth=8;c.beginPath();c.arc(x,y,30+ph*110,0,TAU);c.stroke();}}
const visage=(c,f)=>{c.fillStyle=rgb(PERSOS.heros.skin);c.beginPath();c.arc(0,0,72,0,TAU);c.fill();c.fillStyle=PERSOS.heros.hair;c.beginPath();c.arc(0,-24,74,Math.PI,0);c.fill();c.fillStyle='#222';c.beginPath();c.arc(-24,4,7,0,TAU);c.arc(24,4,7,0,TAU);c.fill();f(c);};
ICO.sueur=c=>visage(c,c=>{c.fillStyle='#7fc4ff';for(const [x,y] of [[-60,-10],[56,20],[40,-40]]){c.beginPath();c.moveTo(x,y-18);c.quadraticCurveTo(x+12,y,x,y+10);c.quadraticCurveTo(x-12,y,x,y-18);c.fill();}});
ICO.nausee=c=>visage(c,c=>{c.strokeStyle='#5a9a3a';c.lineWidth=7;c.beginPath();c.moveTo(-26,36);c.quadraticCurveTo(-13,26,0,36);c.quadraticCurveTo(13,46,26,36);c.stroke();c.fillStyle='rgba(120,180,90,0.35)';c.beginPath();c.arc(0,10,72,0,TAU);c.fill();});
ICO.souffle=c=>visage(c,c=>{c.fillStyle='#3a1712';c.beginPath();c.ellipse(0,38,14,18,0,0,TAU);c.fill();c.strokeStyle='rgba(200,220,255,0.9)';c.lineWidth=6;for(let i=0;i<3;i++){c.beginPath();c.moveTo(80,10+i*16);c.lineTo(110+i*6,10+i*16);c.stroke();}});
const SCENES=[
(c,t,d)=>{const [B,b]=salon(t);douleur(b,t,640,900,220,ease(seg(t,0.2,1.0)));AMB(b);accroche(c,t,d,B,camAt(t,d,{x:720,y:900,z:1.4},{x:730,y:880,z:1.55}),['tu faisais','une crise cardiaque ?']);
  c.save();camXf(c,camAt(t,d,{x:720,y:900,z:1.4},{x:730,y:880,z:1.55}));pulse(c,640+0.55*220,900+0.95*220,clamp(t-0.6),t);c.restore();},
(c,t,d)=>{const [B,b]=salon(t);assis(b,t,640,820);AMB(b);const k=ease(seg(t,C('serre',1.6)-0.2,C('serre',1.6)+0.6));const B2=buf('w2',WB,H),b2=B2.getContext('2d');b2.drawImage(B,0,0);
  show(c,B,{x:720,y:1150,z:1.0});if(k>0){const [B3,b3]=salon(t);assis(b3,t,640,820,{near:{to:[640+0.55*230,820+0.95*230],hand:'open',ang:-2.6},ex:{eye:0.5,brow:0.9,mouth:0.3}});AMB(b3);c.save();c.globalAlpha=k;show(c,B3,{x:720,y:1150,z:1.0});c.restore();}
  grade(c,t);tag(c,'AU REPOS',T1,clamp((t-C('repos',2.6))/0.3),'sombre');tag(c,'UNE DOULEUR QUI SERRE LA POITRINE',T2,clamp((t-C('serre',1.6))/0.3),'rouge',36);tag(c,'C’EST PEUT-ÊTRE UNE URGENCE',1250,clamp((t-C('urgence',4.0))/0.3),'rouge',40);},
(c,t,d)=>{darkBg(c);kicker(c,'LA DOULEUR PEUT S’ÉTENDRE',300,1);const r='rgba(229,57,53,0.95)',a=(k,dd)=>clamp((t-C(k,dd))/0.3)>0?r:undefined;
  corps(c,W/2,1060,1.05,{corps:'rgba(229,57,53,0.6)',brasG:a('bras',1.4),brasD:a('bras',1.4),tete:a('machoire',3.0)});pulse(c,W/2,1060-100*1.05,1,t);
  tag(c,'BRAS',400,clamp((t-C('bras',1.4))/0.3),'rouge',40);tag(c,'DOS',490,clamp((t-C('dos',2.2))/0.3),'rouge',40);tag(c,'MÂCHOIRE',580,clamp((t-C('machoire',3.0))/0.3),'rouge',40);grade(c,t,{vig:0.5});},
(c,t,d)=>planche(c,t,t,[['sueur','',C('sueurs',0.6)-0.2,'sueurs'],['nausee','',C('nausees',1.4)-0.2,'nausées'],['souffle','',C('essoufflement',2.4)-0.2,'essoufflement']],{kicker:'D’AUTRES SIGNES POSSIBLES',cols:3,s:0.95,y:880}),
(c,t,d)=>{darkBg(c);kicker(c,'ATTENTION',300,1);picto(c,'coeur',W/2,880,1.6,clamp(t/0.3),'');tag(c,'PAS TOUJOURS DE DOULEUR TYPIQUE',1250,clamp((t-C('toujours',1.6))/0.3),'jaune',38);grade(c,t,{vig:0.45});},
(c,t,d)=>{const [B,b]=salon(t);assis(b,t,640,820,{lean:-0.06,ex:{eye:0.35,brow:0.3,mouth:0.1}});AMB(b);show(c,B,{x:720,y:1100,z:1.1});grade(c,t);
  tag(c,'UN MALAISE',T1,clamp((t-C('malaise',2.2))/0.3),'rouge',44);tag(c,'UNE FATIGUE INEXPLIQUÉE',T2,clamp((t-C('fatigue',3.2))/0.3),'rouge',40);},
(c,t,d)=>{const [B,b]=salon(t);const ph=seg(t,C('compose',1.6)-0.4,C('compose',1.6));assis(b,t,640,820,{near:{to:[640+1.45*230,820+0.6*230],hand:'grip',ang:-1.3},ex:{eye:0.7,brow:0.6,mouth:0.2}});
  if(ph>0.5)phone(b,640+1.45*230+Math.cos(-1.3)*0.34*230,820+0.6*230+Math.sin(-1.3)*0.34*230,-0.12,t,1.2);AMB(b);show(c,B,{x:760,y:1060,z:1.15});grade(c,t);
  tag(c,'COMPOSE IMMÉDIATEMENT LE 112',T1,clamp((t-C('compose',1.6))/0.3),'vert',40);tag(c,'MÊME SI TU HÉSITES',T2,clamp((t-C('hesites',3.4))/0.3),'jaune',42);},
(c,t,d)=>{const [B,b]=salon(t);assis(b,t,640,820,{near:{to:[640+1.45*230,820+0.6*230],hand:'grip',ang:-1.3},ex:{eye:0.7,brow:0.4,mouth:0.4}});phone(b,640+1.45*230+Math.cos(-1.3)*0.34*230,820+0.6*230+Math.sin(-1.3)*0.34*230,-0.12,t,1.2);AMB(b);
  show(c,B,{x:760,y:1060,z:1.15});grade(c,t);bubble(c,W/2+40,1260,'J’AI MAL À LA POITRINE',clamp((t-C('decris',0.4))/0.3));tag(c,'DÉCRIS CE QUE TU RESSENS',T1,clamp((t-C('decris',0.4))/0.3),'vert',40);tag(c,'RÉPONDS AUX QUESTIONS',T2,clamp((t-C('reponds',2.4))/0.3),'vert',40);},
(c,t,d)=>planche(c,t,t,[['secours','oui',0.2,'secours'],['hopital','oui',C('prise',1.8)-0.2,'prise en charge rapide']],{kicker:'LES SECOURS S’ORGANISENT',y:860}),
(c,t,d)=>{planche(c,t,t,[['horloge','oui',0.3,'agis vite']],{kicker:'NE BANALISE PAS CES SYMPTÔMES',y:820,s:1.8});tag(c,'PLUS TÔT LES SOINS COMMENCENT…',1250,clamp((t-C('soins',2.6))/0.3),'vert',38);tag(c,'MOINS DE LÉSIONS',1340,clamp((t-C('lesions',4.6))/0.3),'vert',42);},
(c,t,d)=>fin(c,t,d,[['Douleur qui serre la poitrine',PAL.rouge],['Bras, dos, mâchoire, sueurs, nausées',PAL.rouge],['Parfois juste un malaise',PAL.rouge],['112 tout de suite, même si tu hésites',PAL.vert]]),
];
