['brûlure','douleur','démangeaisons','frictionner','gratter','alcool','graves','respirer','morte','nombreuses'].forEach(w=>RED_W.add(w));
['reviens','rivage','rince','mer','secours','observe','112','renonce'].forEach(w=>GREEN_W.add(w));
function mer(T){const B=buf('w',WB,H),b=B.getContext('2d');plage(b,T,{});return [B,b];}
const JOUR=b=>ambiance(b,[{x:1200,y:200,r:1900,c:'rgba(255,240,210,0.6)'}],'#c8c8cc');
const BAIN={...PERSOS.heros,shirt:[40,150,190],shirtD:[20,90,120]};
function nageur(b,T,x,y,u,k,o={}){const P=[x+0.75*u,y+0.7*u];acteur(b,BAIN,x,y,u,{lean:0.05,look:0.9,tilt:0.15*k,ex:{eye:lerp(0.8,1,k),brow:0.9*k,mouth:0.5*k},near:{to:[P[0]+0.2*u,P[1]+0.1*u],hand:'open',ang:-0.4},far:{to:P,hand:'grip',bend:-1},walk:o.walk});return P;}
function meduses(c,T,a){if(a<=0)return;c.save();c.globalAlpha=a;for(const [x,y,s] of [[300,1080,0.5],[900,1000,0.4],[1150,1110,0.45]]){c.save();c.translate(x+Math.sin(T+x)*14,y+Math.cos(T*1.3+x)*8);c.scale(s,s);ICO.meduse(c);c.restore();}c.restore();}
function brule(c,x,y,a,T){if(a<=0)return;for(let i=0;i<3;i++){const ph=(T*1.4+i/3)%1;c.strokeStyle=`rgba(229,57,53,${a*(1-ph)})`;c.lineWidth=6;c.beginPath();c.arc(x,y,20+ph*80,0,TAU);c.stroke();}}
const SCENES=[
(c,t,d)=>{const [B,b]=mer(t);const k=ease(seg(t,0.4,1.0));const P=nageur(b,t,760,1000,180,k);JOUR(b);const cam=camAt(t,d,{x:760,y:960,z:1.0},{x:760,y:960,z:1.08});accroche(c,t,d,B,cam,['une méduse te piquait','pendant une baignade ?']);c.save();camXf(c,cam);meduses(c,t,1);brule(c,P[0],P[1],k,t);c.restore();},
(c,t,d)=>{const [B,b]=mer(t);const k=ease(seg(t,C('rivage',3.0)-0.4,d));const P=nageur(b,t,lerp(760,600,k),1000,180,1,{walk:k>0.02&&k<0.98?t*1.5:null});JOUR(b);show(c,B,{x:760,y:960,z:1.05});grade(c,t);c.save();camXf(c,{x:760,y:960,z:1.05});meduses(c,t,1);brule(c,P[0],P[1],1,t);c.restore();
  tag(c,'UNE BRÛLURE SOUDAINE',T1,clamp((t-C('brulure',1.4))/0.3),'rouge',40);tag(c,'REVIENS VERS LE RIVAGE',T2,clamp((t-C('rivage',3.0))/0.3),'vert',40);},
(c,t,d)=>planche(c,t,t,[['meduse','',0.2,'filaments'],['plaque','',C('douleur',2.6)-0.3,'douleur, démangeaisons']],{kicker:'LE CONTACT AVEC UNE MÉDUSE',y:860}),
(c,t,d)=>planche(c,t,t,[['eauMer','oui',C('rince',0.2)-0.1,'eau de mer'],['linge','non',C('frictionner',2.0)-0.3,'sans frotter']],{kicker:'RINCE LA ZONE',y:860}),
(c,t,d)=>{const [B,b]=mer(t);nageur(b,t,980,1000,170,0.6);acteur(b,{...PERSOS.femme,shirt:[220,60,60],shirtD:[150,30,30]},1240,1000,170,{look:0.9,ex:{eye:0.8,brow:0.3,mouth:0.2},near:{to:[1240+1.0*170,1000+0.8*170],hand:'open'},far:{bend:-1}},{mirror:true});JOUR(b);show(c,B,{x:1060,y:960,z:1.1});grade(c,t);
  tag(c,'VA AU POSTE DE SECOURS',T1,clamp((t-C('secours',1.0))/0.3),'vert',40);tag(c,'ILS RETIRENT LES FILAMENTS',T2,clamp((t-C('filaments',3.0))/0.3),'vert',40);},
(c,t,d)=>planche(c,t,t,[['plaque','non',C('gratter',0.6)-0.2,'ne gratte pas'],['alcool','non',C('alcool',2.0)-0.3,'pas d’alcool']],{kicker:'ÉVITE',y:860}),
(c,t,d)=>{planche(c,t,t,[['oeil','oui',C('observe',0.2)-0.1,'observe la réaction']],{kicker:'ENSUITE',y:820,s:1.8});tag(c,'CERTAINES ESPÈCES : COMPLICATIONS GRAVES',1250,clamp((t-C('graves',3.2))/0.3),'rouge',32);},
(c,t,d)=>{planche(c,t,t,[['poumons','',C('respirer',0.8)-0.2,'mal à respirer'],['secours','oui',C('appelle',3.4)-0.3,'112 en Europe']],{kicker:'URGENCE',y:860});tag(c,'APPELLE LES SECOURS',1250,clamp((t-C('respirer',0.8)+0.6)/0.3),'vert',42);},
(c,t,d)=>{planche(c,t,t,[['meduse','non',0.3,'même échouée']],{kicker:'SUR LE SABLE AUSSI',y:820,s:1.8});tag(c,'UNE MÉDUSE MORTE PEUT PIQUER',1250,clamp((t-C('morte',1.4))/0.3),'rouge',38);},
(c,t,d)=>planche(c,t,t,[['meduse','',0.2,'méduses nombreuses'],['nageur','non',C('renonce',2.4)-0.3,'pas de baignade']],{kicker:'POUR ÉVITER UN NOUVEL ACCIDENT',y:860}),
(c,t,d)=>fin(c,t,d,[['Sors de l’eau, rince à l’eau de mer',PAL.vert],['Poste de secours pour les filaments',PAL.vert],['Ni grattage, ni alcool',PAL.rouge],['Mal à respirer : 112',PAL.rouge]]),
];
