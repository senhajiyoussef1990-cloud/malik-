['casse','fragment','profondément','tendon','nerf','intense','croissante','infection','rougeur','chaude','gonflement'].forEach(w=>RED_W.add(w));
['avis','médical','consultation','imagerie','surveille','consulter','tétanos','vaccination','quarante-huit'].forEach(w=>GREEN_W.add(w));
function cuisine(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'cuisine',T,{plaques:false});b.save();b.translate(980,1150);b.scale(0.6,0.6);ICO.eclatsVerre(b);b.restore();b.save();b.translate(1100,1170);b.scale(0.45,0.45);b.rotate(1);ICO.eclatsVerre(b);b.restore();return [B,b];}
const AMB=b=>ambiance(b,[LAMPE(735,500,1.1),LAMPE(500,900,0.6,900)],'#6a6a72');
function blesse(b,T,x,y,u,k){const P=[x+0.75*u,y+1.0*u];acteur(b,'heros',x,y,u,{lean:0.08*k,look:0.95,tilt:0.2*k,ex:{eye:lerp(0.8,1,k),brow:0.9*k,mouth:0.4*k},near:{to:P,hand:'open',ang:-0.6},far:{to:[P[0]-0.12*u,P[1]+0.2*u],hand:'grip',bend:-1}});return P;}
function pulse(c,x,y,a,T){if(a<=0)return;for(let i=0;i<3;i++){const ph=(T*1.4+i/3)%1;c.strokeStyle=`rgba(229,57,53,${a*(1-ph)})`;c.lineWidth=6;c.beginPath();c.arc(x,y,20+ph*80,0,TAU);c.stroke();}}
const SCENES=[
(c,t,d)=>{const [B,b]=cuisine(t);const k=ease(seg(t,0.3,1.0));const P=blesse(b,t,800,1000,190,k);AMB(b);const cam=camAt(t,d,{x:800,y:960,z:1.05},{x:820,y:960,z:1.15});accroche(c,t,d,B,cam,['un fragment de verre','restait profondément','sous ta peau ?']);c.save();camXf(c,cam);pulse(c,P[0],P[1],k,t);c.restore();},
(c,t,d)=>{const [B,b]=cuisine(t);const P=blesse(b,t,800,1000,190,1);AMB(b);const cam={x:P[0]-60,y:P[1]-160,z:1.5};show(c,B,cam);grade(c,t);c.save();camXf(c,cam);pulse(c,P[0],P[1],1,t);c.restore();
  tag(c,'UN OBJET SE CASSE',T1,clamp((t-C('casse',0.6))/0.3),'sombre',42);tag(c,'UN FRAGMENT DANS TA MAIN',T2,clamp((t-C('fragment',1.6))/0.3),'rouge',40);},
(c,t,d)=>planche(c,t,t,[['mainVerre','',0.2,'fragment profond'],['pharmacien','oui',C('avis',2.6)-0.3,'avis médical']],{kicker:'PROFONDÉMENT LOGÉ ?',y:860}),
(c,t,d)=>{planche(c,t,t,[['tendon','',0.3,'tendon, nerf']],{kicker:'UN GROS ÉCLAT PEUT ABÎMER',y:820,s:1.8});tag(c,'DES STRUCTURES IMPORTANTES',1250,clamp((t-C('tendon',2.8)+0.3)/0.3),'rouge',40);},
(c,t,d)=>{planche(c,t,t,[['choc','',0.3,'intense ou croissante']],{kicker:'UNE DOULEUR',y:820,s:1.8});tag(c,'CONSULTE AUSSI',1250,clamp((t-1.8)/0.3),'vert',44);},
(c,t,d)=>{planche(c,t,t,[['imagerie','oui',C('imagerie',1.4)-0.3,'imagerie']],{kicker:'FRAGMENT DIFFICILE À TROUVER ?',y:820,s:1.8});tag(c,'LE MÉDECIN PEUT LE REPÉRER',1250,clamp((t-C('imagerie',1.4)+0.4)/0.3),'vert',38);},
(c,t,d)=>planche(c,t,t,[['pince','',0.2,'après le retrait'],['infection','',C('infection',2.4)-0.3,'surveille l’infection']],{kicker:'ENSUITE',y:860}),
(c,t,d)=>{planche(c,t,t,[['plaque','',C('rougeur',0.6)-0.2,'rougeur'],['thermo','',C('chaude',1.8)-0.2,'chaleur'],['infection','',C('gonflement',2.6)-0.2,'gonflement']],{kicker:'CONSULTE SI',cols:3,s:0.95,y:880});},
(c,t,d)=>{planche(c,t,t,[['vaccin','oui',C('tetanos',2.0)-0.4,'vaccin à jour ?']],{kicker:'VÉRIFIE AUSSI',y:820,s:1.8});tag(c,'TÉTANOS',1250,clamp((t-C('tetanos',2.0))/0.3),'vert',46);},
(c,t,d)=>{planche(c,t,t,[['vaccin','non',0.2,'pas à jour']],{kicker:'SI ELLE NE L’EST PAS',y:820,s:1.8});c.save();c.font='900 84px M';c.fillStyle=PAL.etsi;c.textAlign='center';c.globalAlpha=clamp((t-C('quarante',1.8))/0.3);c.fillText('consulte sous 48 h',W/2,1270);c.restore();},
(c,t,d)=>fin(c,t,d,[['Fragment profond : avis médical',PAL.vert],['Tendon, nerf, douleur croissante : consulte',PAL.rouge],['Rougeur, chaleur, gonflement : infection ?',PAL.rouge],['Tétanos pas à jour : sous 48 h',PAL.vert]]),
];
