['douleur','épines','infection','généraux'].forEach(w=>RED_W.add(w));
['sors','pince','désinfecter','évaluation','chaussures','protection'].forEach(w=>GREEN_W.add(w));
function mer(T){const B=buf('w',WB,H),b=B.getContext('2d');plage(b,T,{rochers:true,poste:false});return [B,b];}
const JOUR=b=>ambiance(b,[{x:1200,y:200,r:1900,c:'rgba(255,240,210,0.6)'}],'#c8c8cc');
const BAIN={...PERSOS.heros,shirt:[40,150,190],shirtD:[20,90,120]};
function marcheur(b,T,x,y,u,k,o={}){acteur(b,BAIN,x,y,u,{lean:0.15*k,look:0.95,tilt:0.25*k,ex:{eye:lerp(0.8,1,k),brow:0.9*k,mouth:0.5*k},near:k>0.4?{to:[x+0.5*u,y+2.6*u],hand:'open',ang:1.6}:{},far:{bend:-1},walk:o.walk});return [x+0.3*u,y+5.5*u];}
function aie(c,x,y,a,T){if(a<=0)return;for(let i=0;i<3;i++){const ph=(T*1.4+i/3)%1;c.strokeStyle=`rgba(229,57,53,${a*(1-ph)})`;c.lineWidth=7;c.beginPath();c.arc(x,y,24+ph*90,0,TAU);c.stroke();}}
function oursins(b){for(const [x,y,s] of [[1000,1620,0.5],[1120,1660,0.4],[560,1700,0.45]]){b.save();b.translate(x,y);b.scale(s,s);ICO.oursin(b);b.restore();}}
const SCENES=[
(c,t,d)=>{const [B,b]=mer(t);oursins(b);const k=ease(seg(t,0.5,1.0));const A=marcheur(b,t,760,1000,170,k,{walk:t<0.6?t*1.5:null});JOUR(b);const cam=camAt(t,d,{x:800,y:960,z:1.0},{x:800,y:980,z:1.08});accroche(c,t,d,B,cam,['tu marchais','sur un oursin ?']);c.save();camXf(c,cam);aie(c,A[0],A[1],k,t);c.restore();},
(c,t,d)=>{const [B,b]=mer(t);oursins(b);const k=ease(seg(t,C('douleur',2.6)-0.4,C('douleur',2.6)+0.2));const A=marcheur(b,t,760,1000,170,k,{walk:k<0.1?t*1.5:null});JOUR(b);const cam=camAt(t,d,{x:800,y:960,z:1.0},{x:A[0]+40,y:A[1]-260,z:1.5});show(c,B,cam);grade(c,t);c.save();camXf(c,cam);aie(c,A[0],A[1],k,t);c.restore();
  tag(c,'PIEDS NUS ENTRE LES ROCHERS',T1,clamp((t-C('pieds',0.6))/0.3),'sombre',38);tag(c,'UNE DOULEUR AIGUË',T2,clamp((t-C('douleur',2.6))/0.3),'rouge',42);},
(c,t,d)=>planche(c,t,t,[['oursin','',0.2,'épines d’oursin'],['piedBlesse','',C('epines',1.4)+0.6,'restent dans la peau']],{kicker:'ATTENTION',y:860}),
(c,t,d)=>{planche(c,t,t,[['sandales','oui',C('sors',0.2)-0.1,'sors de l’eau']],{kicker:'EN SÉCURITÉ',y:820,s:1.8});tag(c,'EXAMINE LA ZONE',1250,clamp((t-1.6)/0.3),'vert',44);},
(c,t,d)=>{planche(c,t,t,[['infection','',C('infection',2.8)-0.4,'infection possible']],{kicker:'GÉNÉRALEMENT BÉNIN, MAIS',y:820,s:1.8});},
(c,t,d)=>{planche(c,t,t,[['pince','oui',C('pince',3.0)-0.4,'pince à épiler']],{kicker:'ÉPINES ACCESSIBLES',y:820,s:1.8});tag(c,'RECOMMANDATION CROIX-ROUGE',1250,clamp((t-0.6)/0.3),'sombre',38);},
(c,t,d)=>{planche(c,t,t,[['antiseptique','oui',C('desinfecter',1.0)-0.2,'désinfecte']],{kicker:'ENSUITE',y:820,s:1.8});},
(c,t,d)=>{planche(c,t,t,[['vertige','',C('generaux',1.6)-0.3,'symptômes généraux'],['hopital','oui',C('generaux',1.6)+0.6,'évaluation urgente']],{kicker:'SI ÇA SE GÉNÉRALISE',y:860});},
(c,t,d)=>planche(c,t,t,[['sandales','oui',C('chaussures',1.6)-0.3,'chaussures adaptées']],{kicker:'POUR TE PROTÉGER',y:820,s:1.8}),
(c,t,d)=>planche(c,t,t,[['piedBlesse','non',C('protection',1.6)-0.3,'pas pieds nus'],['oursin','',0.2,'fonds rocheux']],{kicker:'ÉVITE DE MARCHER SANS PROTECTION',y:860}),
(c,t,d)=>fin(c,t,d,[['Sors de l’eau, examine la zone',PAL.vert],['Épines accessibles : pince à épiler',PAL.vert],['Désinfecte, surveille l’infection',PAL.vert],['Chaussures sur les rochers',PAL.vert]]),
];
