['intense','soudaine','rigide','douloureux','chute','violente','mal','grossesse','inhabituelle'].forEach(w=>RED_W.add(w));
['urgents','112','secours','consulte','journée','évaluée'].forEach(w=>GREEN_W.add(w));
function salon(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'salon',T,{radiateur:false});return [B,b];}
const AMB=b=>ambiance(b,[LAMPE(760,500,1.1),LAMPE(300,600,0.5)],'#6a6a72');
function plie(b,T,x,y,u,k){const V=[x+0.55*u,y+1.55*u];acteur(b,'heros',x,y,u,{lean:0.3*k,look:0.7,tilt:0.15*k,ex:{eye:lerp(0.8,0.25,k),brow:0.95*k,mouth:0.5*k},near:{to:[V[0]+0.15*u,V[1]],hand:'open',ang:-2.8},far:{to:[V[0]-0.05*u,V[1]+0.15*u],hand:'open',bend:-1}});return V;}
function pulse(c,x,y,a,T){if(a<=0)return;for(let i=0;i<3;i++){const ph=(T*1.4+i/3)%1;c.strokeStyle=`rgba(229,57,53,${a*(1-ph)})`;c.lineWidth=8;c.beginPath();c.arc(x,y,30+ph*110,0,TAU);c.stroke();}}
const SCENES=[
(c,t,d)=>{const [B,b]=salon(t);const k=ease(seg(t,0.2,0.8));const V=plie(b,t,700,1000,190,k);AMB(b);const cam=camAt(t,d,{x:760,y:960,z:1.05},{x:780,y:960,z:1.15});accroche(c,t,d,B,cam,['une douleur brutale','te traversait le ventre ?']);c.save();camXf(c,cam);pulse(c,V[0],V[1],k,t);c.restore();},
(c,t,d)=>{const [B,b]=salon(t);const k=ease(seg(t,C('intense',2.4)-0.3,C('intense',2.4)+0.3));const V=plie(b,t,700,1000,190,k);AMB(b);const cam={x:760,y:1060,z:1.3};show(c,B,cam);grade(c,t);c.save();camXf(c,cam);pulse(c,V[0],V[1],k,t);c.restore();
  tag(c,'CHEZ TOI, SANS PRÉVENIR',T1,clamp((t-0.2)/0.3),'sombre',40);tag(c,'UNE DOULEUR TRÈS INTENSE',T2,clamp((t-C('intense',2.4))/0.3),'rouge',40);},
(c,t,d)=>planche(c,t,t,[['ventre','',0.2,'mal au ventre'],['hopital','oui',C('urgents',3.2)-0.4,'soins urgents']],{kicker:'PAS TOUTES BÉNIGNES',y:860}),
(c,t,d)=>{planche(c,t,t,[['ventre','',0.2,'soudaine et intense']],{kicker:'SI LA DOULEUR EST',y:820,s:1.8});tag(c,'APPELLE LE 112',1250,clamp((t-C('appelle',2.2))/0.3),'vert',46);},
(c,t,d)=>{planche(c,t,t,[['ventreDur','',C('rigide',1.0)-0.3,'ventre rigide']],{kicker:'SIGNAL D’URGENCE',y:820,s:1.8});tag(c,'RIGIDE ET DOULOUREUX : 112',1250,clamp((t-C('rigide',1.0))/0.3),'rouge',40);},
(c,t,d)=>{planche(c,t,t,[['chute','',C('chute',1.4)-0.3,'après une chute violente']],{kicker:'PRISE EN CHARGE RAPIDE',y:820,s:1.8});},
(c,t,d)=>{planche(c,t,t,[['ventre','',0.2,'douleur'],['poumons','',C('respirer',1.0)-0.2,'mal à respirer']],{kicker:'EN MÊME TEMPS ?',y:860});tag(c,'CONTACTE LES SECOURS',1250,clamp((t-C('secours',3.0))/0.3),'vert',42);},
(c,t,d)=>{planche(c,t,t,[['grossesse','',C('grossesse',1.6)-0.3,'pendant une grossesse']],{kicker:'DOULEUR INHABITUELLE',y:820,s:1.8});tag(c,'ÉVALUATION EN URGENCE',1250,clamp((t-C('grossesse',1.6)+0.6)/0.3),'rouge',40);},
(c,t,d)=>{planche(c,t,t,[['horloge','',0.3,'persistante'],['pharmacien','oui',C('journee',3.6)-0.4,'dans la journée']],{kicker:'SANS SIGNE GRAVE',y:860});},
(c,t,d)=>{planche(c,t,t,[['video','non',0.3,'pas d’autodiagnostic']],{kicker:'LA CAUSE ?',y:820,s:1.8});tag(c,'UN MÉDECIN DOIT LA DÉTERMINER',1250,clamp((t-1.6)/0.3),'jaune',38);},
(c,t,d)=>fin(c,t,d,[['Soudaine et intense : 112',PAL.rouge],['Ventre rigide, chute, mal à respirer : 112',PAL.rouge],['Grossesse : évaluation en urgence',PAL.rouge],['Persistante sans signe grave : dans la journée',PAL.vert]]),
];
