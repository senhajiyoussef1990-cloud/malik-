['effondre','inconsciente','halètements','irréguliers','anormale','cesse','traumatisme'].forEach(w=>RED_W.add(w));
['112','haut-parleur','côté','surveille','respire','rassure','réanimation','parle-lui'].forEach(w=>GREEN_W.add(w));
const AMB=b=>ambiance(b,[LAMPE(760,500,1.1),LAMPE(400,1300,0.6,900)],'#55555e');
function piece(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'salon',T,{radiateur:false});b.fillStyle='#3a2e26';b.fillRect(0,1300,WB,H);return [B,b];}
// victime allongée sur le dos (u=150), sur le côté si cote>0
function victime(b,T,cote=0,resp=0){const x=330,y=1500,u=150;painted(b,f=>{f.save();f.translate(x,y);f.rotate(-Math.PI/2+cote*0.0);
  const br=resp?Math.sin(T*2.4)*0.03:0;f.scale(1,1+br);figure(f,0,0,u,{look:0.3,ex:{eye:0.05,brow:0,mouth:0.1},legs:true,near:cote?{to:[-0.6*u,-0.2*u],hand:'open',ang:3.0}:{to:[0.3*u,2.3*u],hand:'rest'},far:cote?{to:[0.9*u,1.0*u],bend:-1}:{to:[-0.3*u,2.2*u],bend:-1}},PERSOS.ami);f.restore();},LT(u,0.7));return [x+0.9*u,y-0.1*u];}
function aidant(b,T,o={}){const x=o.x??900,y=o.y??1130,u=150;return acteur(b,'heros',x,y,u,{lean:o.lean??-0.25,look:1,ex:o.ex||{eye:0.8,brow:0.5,mouth:0.2},near:o.near||{},far:{bend:-1},legs:false},{mirror:true,after:o.after});}
function haut(c,x,y,a,T){if(a<=0)return;c.save();c.globalAlpha=a;c.strokeStyle=PAL.vert;c.lineWidth=7;c.lineCap='round';for(let i=0;i<3;i++){const r=30+i*26+((T*60)%26);c.globalAlpha=a*(1-i/3);c.beginPath();c.arc(x,y,r,-0.7,0.7);c.stroke();}c.restore();}
function souffle(c,x,y,a,T,ok=true){if(a<=0)return;c.save();c.globalAlpha=a;c.strokeStyle=ok?'rgba(150,210,255,0.9)':PAL.rouge;c.lineWidth=6;c.lineCap='round';const ph=(T*0.8)%1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(x+10+ph*40,y-20+i*20);c.lineTo(x+50+ph*40,y-20+i*20);c.stroke();}c.restore();}
const SCENES=[
(c,t,d)=>{const [B,b]=piece(t);victime(b,t,0,1);aidant(b,t,{ex:{eye:1,brow:0.9,mouth:0.5}});AMB(b);accroche(c,t,d,B,camAt(t,d,{x:640,y:1250,z:1.1},{x:640,y:1250,z:1.2}),['quelqu’un perdait','connaissance','mais respirait ?']);},
(c,t,d)=>{const [B,b]=piece(t);const k=ease(seg(t,0.2,1.0));victime(b,t,0,1);aidant(b,t,{x:lerp(1250,980,k),lean:-0.05,ex:{eye:1,brow:0.8,mouth:0.3}});AMB(b);show(c,B,{x:700,y:1200,z:1.0});grade(c,t);
  tag(c,'UNE PERSONNE S’EFFONDRE',T1,clamp((t-C('effondre',0.6))/0.3),'rouge',40);tag(c,'APPROCHE SEULEMENT SANS DANGER',T2,clamp((t-C('danger',2.6))/0.3),'jaune',36);},
(c,t,d)=>{const [B,b]=piece(t);victime(b,t,0,1);aidant(b,t,{ex:{eye:0.8,brow:0.5,mouth:0.5+0.2*Math.sin(t*8)},near:{to:[520,1360],hand:'open',ang:1.4}});AMB(b);show(c,B,{x:640,y:1250,z:1.15});grade(c,t);
  bubble(c,W/2+140,700,'TU M’ENTENDS ?',clamp((t-C('parle',0.2))/0.3));tag(c,'PARLE-LUI : RÉAGIT-ELLE ?',T1,clamp((t-C('parle',0.2))/0.3),'vert',40);tag(c,'TOUJOURS INCONSCIENTE : APPELLE LES SECOURS',T2,clamp((t-C('appelle',2.4))/0.3),'vert',30);},
(c,t,d)=>{const [B,b]=piece(t);const n=victime(b,t,0,1);aidant(b,t,{lean:-0.35});AMB(b);const cam={x:520,y:1380,z:1.6};show(c,B,cam);grade(c,t);c.save();camXf(c,cam);souffle(c,n[0]-260,n[1]-60,clamp((t-0.3)/0.3),t,true);c.restore();
  tag(c,'RESPIRE-T-ELLE NORMALEMENT ?',T1,clamp((t-0.1)/0.3),'vert',40);tag(c,'DES HALÈTEMENTS : CE N’EST PAS NORMAL',T2,clamp((t-C('haletements',2.4))/0.3),'rouge',34);},
(c,t,d)=>{const [B,b]=piece(t);victime(b,t,0,1);aidant(b,t,{});phone(b,780,1600,1.45,t,0.9);AMB(b);
  show(c,B,{x:640,y:1250,z:1.15});grade(c,t);haut(c,(780-640)*1.15+W/2+60,(1600-1250)*1.15+H/2-40,clamp((t-C('haut',1.8))/0.3),t);tag(c,'COMPOSE LE 112',T1,clamp((t-C('compose',0.2))/0.3),'vert',46);tag(c,'ACTIVE LE HAUT-PARLEUR',T2,clamp((t-C('haut',1.8))/0.3),'vert',42);},
(c,t,d)=>{const [B,b]=piece(t);victime(b,t,ease(seg(t,C('cote',2.6)-0.4,C('cote',2.6)+0.6)),1);aidant(b,t,{lean:-0.3});phone(b,780,1600,1.45,t,0.9);AMB(b);show(c,B,{x:640,y:1250,z:1.15});grade(c,t);haut(c,(780-640)*1.15+W/2+60,(1600-1250)*1.15+H/2-40,1,t);
  tag(c,'ELLE RESPIRE NORMALEMENT',T1,clamp((t-0.1)/0.3),'vert',40);tag(c,'L’OPÉRATEUR TE GUIDE : SUR LE CÔTÉ',T2,clamp((t-C('cote',2.6))/0.3),'vert',34);},
(c,t,d)=>{planche(c,t,t,[['secours','oui',0.3,'signale-le d’abord']],{kicker:'TRAUMATISME VIOLENT ?',y:820,s:1.8});tag(c,'AVANT DE LA DÉPLACER',1250,clamp((t-C('deplacer',2.0))/0.3),'jaune',42);},
(c,t,d)=>{const [B,b]=piece(t);const n=victime(b,t,1,1);aidant(b,t,{lean:-0.3,ex:{eye:0.8,brow:0.3,mouth:0.1}});AMB(b);show(c,B,{x:600,y:1300,z:1.3});grade(c,t);c.save();camXf(c,{x:600,y:1300,z:1.3});souffle(c,n[0]-260,n[1]-60,1,t,true);c.restore();
  tag(c,'SURVEILLE SA RESPIRATION',T1,clamp((t-C('surveille',0.2))/0.3),'vert',42);tag(c,'SANS ARRÊT, JUSQU’AUX SECOURS',T2,clamp((t-C('arrivee',2.4))/0.3),'vert',38);},
(c,t,d)=>{planche(c,t,t,[['souffleKO','',0.2,'respiration anormale'],['secours','oui',C('avertis',2.0)-0.2,'avertis l’opérateur']],{kicker:'SI ÇA CHANGE',y:860});tag(c,'SUIS SES INSTRUCTIONS DE RÉANIMATION',1250,clamp((t-C('reanimation',3.6))/0.3),'vert',34);},
(c,t,d)=>{const [B,b]=piece(t);acteur(b,'ami',420,1060,160,{lean:0.1,look:0.6,ex:{eye:0.4,brow:0.2,mouth:0.1},near:{to:[420+0.9*160,1060+2.2*160],hand:'rest'},legs:false});aidant(b,t,{x:900,lean:-0.12,ex:{eye:0.7,brow:0,mouth:0.2},near:{to:[600,1260],hand:'open',ang:1.4}});AMB(b);
  show(c,B,{x:660,y:1200,z:1.1});grade(c,t);tag(c,'ELLE REPREND CONNAISSANCE',T1,clamp((t-0.1)/0.3),'sombre',40);tag(c,'RASSURE-LA · DIS LA DURÉE DU MALAISE',T2,clamp((t-C('duree',2.6))/0.3),'vert',34);},
(c,t,d)=>fin(c,t,d,[['Parle-lui, vérifie sa respiration',PAL.vert],['112 sur haut-parleur',PAL.vert],['Respire : sur le côté, guidé par l’opérateur',PAL.vert],['Respiration anormale : avertis tout de suite',PAL.rouge]]),
];
ICO.souffleKO=c=>{c.fillStyle=rgb(PERSOS.ami.skin);c.beginPath();c.arc(0,0,72,0,TAU);c.fill();c.fillStyle=PERSOS.ami.hair;c.beginPath();c.arc(0,-24,74,Math.PI,0);c.fill();c.strokeStyle='#222';c.lineWidth=6;for(const x of [-24,24]){c.beginPath();c.moveTo(x-10,4);c.lineTo(x+10,4);c.stroke();}c.strokeStyle=PAL.rouge;c.lineWidth=6;c.beginPath();c.moveTo(80,0);c.lineTo(100,-14);c.lineTo(114,10);c.lineTo(130,-6);c.stroke();};
