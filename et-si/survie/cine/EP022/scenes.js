['tique','lyme','écraser','creuse','plaque','fièvre','douleurs','fatigue'].forEach(w=>RED_W.add(w));
['retire-la','tire-tique','crochet','traction','rotation','désinfecte','lave','surveille','consulte','professionnel'].forEach(w=>GREEN_W.add(w));
function sentier(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'sentier',T);return [B,b];}
const JOUR=b=>ambiance(b,[{x:1200,y:200,r:1900,c:'rgba(255,240,210,0.6)'}],'#c4c4c8');
// promeneur qui regarde sa jambe
function promeneur(b,T,x,y,u,k=1,o={}){const R=acteur(b,'heros',x,y,u,{lean:0.18*k,look:0.95,tilt:0.25*k,ex:{eye:0.9,brow:0.6*k,mouth:0.2*k},near:o.near||{to:[x+0.5*u,y+2.6*u],hand:'point',ang:1.6},far:{to:[x+0.1*u,y+2.2*u],bend:-1},walk:o.walk});
  const tx=x+0.22*u,ty=y+3.55*u;b.save();b.translate(tx,ty);b.scale(0.16*u/100,0.16*u/100);ICO.tique(b);b.restore();return [tx,ty];}
// gros plan peau + tique + tire-tique : a = approche (0..1), r = rotation/traction (0..1)
function grosPlan(c,t,a,r,o={}){darkBg(c);c.save();c.fillStyle=lg(c,0,700,0,1300,[[0,'#d8a888'],[1,'#c08a6a']]);c.beginPath();c.roundRect(-40,760,W+80,460,60);c.fill();
  c.fillStyle='rgba(120,70,50,0.12)';for(let i=0;i<40;i++){const r2=mulberry(i);c.beginPath();c.arc(r2()*W,780+r2()*420,3,0,TAU);c.fill();}
  const lift=r*120;c.save();c.translate(W/2,900-lift);c.rotate(r*Math.PI*1.2);c.scale(1.5,1.5);ICO.tique(c);c.restore();
  if(a>0){const x=lerp(W+300,W/2+40,ease(a));c.save();c.translate(x,940-lift);c.rotate(r*Math.PI*1.2*0.5);c.scale(-2.2,2.2);ICO.tireTique(c);c.restore();}
  if(r>0){c.strokeStyle=PAL.vert;c.lineWidth=10;c.lineCap='round';c.beginPath();c.arc(W/2,900-lift,190,-0.6,-0.6+r*4.5);c.stroke();}c.restore();}
const SCENES=[
(c,t,d)=>{const [B,b]=sentier(t);const k=ease(seg(t,0.2,1.0));promeneur(b,t,640,900,180,k);JOUR(b);accroche(c,t,d,B,camAt(t,d,{x:720,y:960,z:1.0},{x:720,y:1000,z:1.06}),['une tique','s’accrochait à ta peau ?']);},
(c,t,d)=>{const [B,b]=sentier(t);const p=promeneur(b,t,640,900,180,1);JOUR(b);const cam=camAt(t,d,{x:740,y:1250,z:1.0},{x:p[0],y:p[1]-120,z:2.0});show(c,B,cam);grade(c,t);
  c.save();camXf(c,cam);c.strokeStyle=PAL.etsi;c.lineWidth=6;c.beginPath();c.arc(p[0],p[1],40,0,TAU*clamp((t-C('tique',1.6))/0.5));c.stroke();c.restore();
  tag(c,'APRÈS UNE PROMENADE',T1,clamp((t-0.1)/0.3),'sombre',40);tag(c,'UNE TIQUE FIXÉE SUR TA JAMBE',T2,clamp((t-C('jambe',2.6))/0.3),'rouge',38);},
(c,t,d)=>{planche(c,t,t,[['tique','',0.2,'tique']],{kicker:'NE LA LAISSE PAS',y:820,s:1.8});tag(c,'RETIRE-LA RAPIDEMENT',1250,clamp((t-C('retire',0.2))/0.3),'vert',44);tag(c,'RISQUE : MALADIE DE LYME',1340,clamp((t-C('lyme',2.8))/0.3),'rouge',40);},
(c,t,d)=>{planche(c,t,t,[['flacon','non',0.3,'aucun produit']],{kicker:'AVANT DE LA RETIRER',y:820,s:1.8});tag(c,'N’APPLIQUE RIEN SUR LA TIQUE',1250,clamp((t-C('produit',1.0))/0.3),'rouge',40);},
(c,t,d)=>{grosPlan(c,t,seg(t,C('crochet',1.8)-0.6,C('crochet',1.8)+0.6),0);grade(c,t,{vig:0.45});kicker(c,'UTILISE UN TIRE-TIQUE',300,1);
  tag(c,'CROCHET SOUS LA TIQUE, PRÈS DE LA PEAU',420,clamp((t-C('crochet',1.8))/0.3),'vert',34);tag(c,'SANS L’ÉCRASER',510,clamp((t-C('ecraser',4.0))/0.3),'rouge',42);},
(c,t,d)=>{grosPlan(c,t,1,ease(seg(t,C('traction',1.4)-0.2,d-0.3)));grade(c,t,{vig:0.45});kicker(c,'DOUCEMENT',300,1);
  tag(c,'TRACTION',420,clamp((t-C('traction',1.4))/0.3),'vert',44);tag(c,'+ ROTATION',510,clamp((t-C('rotation',2.4))/0.3),'vert',44);},
(c,t,d)=>planche(c,t,t,[['couteau','non',C('creuse',1.4)-0.2,'ne creuse pas'],['pharmacien','oui',C('professionnel',2.8)-0.2,'demande conseil']],{kicker:'UNE PARTIE RESTE DANS LA PEAU ?',y:860}),
(c,t,d)=>planche(c,t,t,[['antiseptique','oui',C('desinfecte',0.2)-0.1,'désinfecte la peau'],['savon','oui',C('mains',1.8)-0.3,'lave tes mains']],{kicker:'ENSUITE',y:860}),
(c,t,d)=>{planche(c,t,t,[['plaque','',C('plaque',2.4)-0.3,'plaque rouge qui s’étend']],{kicker:'SURVEILLE LA ZONE PENDANT 1 MOIS',y:820,s:1.8});tag(c,'CONSULTE',1250,clamp((t-C('plaque',2.4)-1.0)/0.3),'vert',46);},
(c,t,d)=>{planche(c,t,t,[['thermo','',C('fievre',1.2)-0.2,'fièvre'],['choc','',C('fievre',1.2)+0.4,'douleurs'],['repos','',C('fatigue',2.6)-0.2,'fatigue inexpliquée']],{kicker:'CONSULTE AUSSI EN CAS DE',cols:3,s:0.95,y:880});},
(c,t,d)=>fin(c,t,d,[['Retire-la vite, au tire-tique',PAL.vert],['Aucun produit, ne l’écrase pas',PAL.rouge],['Désinfecte, lave tes mains',PAL.vert],['Plaque rouge ou fièvre : consulte',PAL.rouge]]),
];
