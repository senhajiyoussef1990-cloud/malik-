['vertiges','nausées','confusion','chaude','sèche','température','conscience','urgence','soif'].forEach(w=>RED_W.add(w));
['112','décris','refroidissement','consignes','évite'].forEach(w=>GREEN_W.add(w));
function jardin(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'jardin',T);b.save();b.translate(1250,230);b.scale(1.4,1.4);ICO.soleil(b);b.restore();return [B,b];}
const SOLEIL=b=>ambiance(b,[{x:1250,y:230,r:2000,c:'rgba(255,230,170,0.75)'}],'#c8c4bc');
function victime(b,T,x,y,u,k){return acteur(b,'ami',x,y,u,{lean:0.08*k+Math.sin(T*1.3)*0.04*k,look:0.5,tilt:0.25*k,ex:{eye:lerp(0.8,0.35,k),brow:0.3,mouth:0.3*k},near:{to:[x+0.85*u,y-0.6*u],hand:'open',ang:-2.6},far:{bend:-1},walk:k<0.5?T*1.2:null});}
function chaleur(c,x,y,a,T){if(a<=0)return;c.save();c.globalAlpha=a;c.strokeStyle='rgba(255,140,80,0.8)';c.lineWidth=6;for(let i=0;i<3;i++){const ph=(T*0.8+i/3)%1;c.beginPath();c.moveTo(x-40+i*40,y-ph*80);c.quadraticCurveTo(x-24+i*40,y-30-ph*80,x-40+i*40,y-60-ph*80);c.stroke();}c.restore();}
function temoin(b,T,x,y,u,o={}){return acteur(b,'heros',x,y,u,{look:1,ex:o.ex||{eye:1,brow:0.8,mouth:0.3},near:o.near||{},far:{bend:-1}},{mirror:true,after:o.after});}
const TEL=(x,y,u,T)=>({near:{to:[x+1.45*u,y+0.6*u],hand:'grip',ang:-1.3},after:f=>phone(f,x+1.45*u+Math.cos(-1.3)*0.34*u,y+0.6*u+Math.sin(-1.3)*0.34*u,-0.12,T,1.0),ex:{eye:0.8,brow:0.6,mouth:0.4+0.2*Math.sin(T*8)}});
const SCENES=[
(c,t,d)=>{const [B,b]=jardin(t);const k=ease(seg(t,0.2,1.4));victime(b,t,600,1000,180,k);temoin(b,t,1120,1000,180,{});SOLEIL(b);const cam=camAt(t,d,{x:820,y:960,z:1.0},{x:820,y:960,z:1.08});accroche(c,t,d,B,cam,['quelqu’un faisait','un coup de chaleur','devant toi ?']);c.save();camXf(c,cam);chaleur(c,760,820,k,t);c.restore();},
(c,t,d)=>{const [B,b]=jardin(t);const k=ease(seg(t,C('bizarrement',2.6)-0.6,C('bizarrement',2.6)+0.4));victime(b,t,600,1000,180,k);temoin(b,t,1120,1000,180,{});SOLEIL(b);show(c,B,{x:820,y:960,z:1.1});grade(c,t);
  tag(c,'UNE JOURNÉE TRÈS CHAUDE',T1,clamp((t-C('chaude',1.0))/0.3),'rouge',40);tag(c,'UN COMPORTEMENT BIZARRE',T2,clamp((t-C('bizarrement',2.6))/0.3),'rouge',40);},
(c,t,d)=>planche(c,t,t,[['vertige','',C('vertiges',0.4)-0.2,'vertiges'],['nausee2','',C('nausees',1.2)-0.2,'nausées'],['confusion','',C('confusion',2.0)-0.2,'confusion']],{kicker:'SIGNES D’ALERTE',cols:3,s:0.95,y:880}),
(c,t,d)=>planche(c,t,t,[['thermo','',C('chaude',1.0)-0.2,'peau chaude'],['goutte','',C('humide',2.6)-0.3,'sèche ou en sueur']],{kicker:'SA PEAU',y:860}),
(c,t,d)=>{planche(c,t,t,[['thermo','',0.2,'très chaud'],['confusion','',C('conscience',3.4)-0.4,'conscience altérée']],{kicker:'TRÈS ALARMANT',y:860});},
(c,t,d)=>{const [B,b]=jardin(t);victime(b,t,600,1000,180,1);temoin(b,t,1120,1000,180,TEL(1120,1000,180,t));SOLEIL(b);show(c,B,{x:840,y:960,z:1.1});grade(c,t);
  tag(c,'C’EST UNE URGENCE MÉDICALE',T1,clamp((t-C('urgence',1.0))/0.3),'rouge',38);tag(c,'APPELLE LE 112 SANS ATTENDRE',T2,clamp((t-C('appelle',2.4))/0.3),'vert',38);},
(c,t,d)=>{const [B,b]=jardin(t);victime(b,t,600,1000,180,1);temoin(b,t,1120,1000,180,TEL(1120,1000,180,t));SOLEIL(b);show(c,B,{x:840,y:960,z:1.1});grade(c,t);bubble(c,W/2+40,1220,'IL A PASSÉ 3 H AU SOLEIL',clamp((t-C('decris',0.2)-0.4)/0.3));
  tag(c,'DÉCRIS SYMPTÔMES ET CIRCONSTANCES',T1,clamp((t-C('decris',0.2))/0.3),'vert',34);},
(c,t,d)=>{planche(c,t,t,[['gorgee','non',0.3,'pas « juste soif »']],{kicker:'NE CONFONDS PAS',y:820,s:1.8});tag(c,'CE N’EST PAS UNE SIMPLE SOIF',1250,clamp((t-C('soif',2.6))/0.3),'rouge',38);},
(c,t,d)=>{planche(c,t,t,[['secours','oui',0.2,'consignes des secours'],['froid','oui',C('refroidissement',1.8)-0.3,'refroidissement']],{kicker:'SUIS IMMÉDIATEMENT',y:860});},
(c,t,d)=>planche(c,t,t,[['soleil','non',C('evite',1.0)-0.2,'exposition prolongée'],['ombre','oui',C('evite',1.0)+0.8,'à l’ombre']],{kicker:'POUR PRÉVENIR',y:860}),
(c,t,d)=>fin(c,t,d,[['Vertiges, confusion, peau brûlante',PAL.rouge],['Urgence : 112 sans attendre',PAL.vert],['Décris les symptômes et la chaleur',PAL.vert],['Suis les consignes de refroidissement',PAL.vert]]),
];
ICO.nausee2=ICO.nausee2||(c=>{_tete(c);c.fillStyle='#222';c.beginPath();c.arc(-24,4,7,0,TAU);c.arc(24,4,7,0,TAU);c.fill();c.strokeStyle='#5a9a3a';c.lineWidth=7;c.beginPath();c.moveTo(-26,36);c.quadraticCurveTo(-13,26,0,36);c.quadraticCurveTo(13,46,26,36);c.stroke();c.fillStyle='rgba(120,180,90,0.35)';c.beginPath();c.arc(0,10,72,0,TAU);c.fill();});
