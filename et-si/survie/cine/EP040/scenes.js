['serpent','mord','capturer','garrot','compressif','coupe','aspirer','venin','glace'].forEach(w=>RED_W.add(w));
['écarte-toi','112','allongé','limite','retire','bijoux','reste','instructions'].forEach(w=>GREEN_W.add(w));
function sentier(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'sentier',T);return [B,b];}
const JOUR=b=>ambiance(b,[{x:1200,y:200,r:1900,c:'rgba(255,240,210,0.6)'}],'#c8c8cc');
function serpent(b,x,y,s,T,mord=0){b.save();b.translate(x,y);b.scale(-s,s);b.rotate(-0.2*mord+Math.sin(T*3)*0.03);ICO.serpent(b);b.restore();}
function randonneur(b,T,x,y,u,k,o={}){return acteur(b,'heros',x,y,u,{lean:-0.12*k,look:o.look??0.95,tilt:0.2*k,ex:{eye:lerp(0.8,1,k),brow:0.9*k,mouth:0.5*k},near:o.near||{to:[x+0.9*u,y+0.4*u],hand:'open',ang:-0.8},far:{bend:-1},walk:o.walk},o.mirror?{mirror:true}:{});}
const SCENES=[
(c,t,d)=>{const [B,b]=sentier(t);const k=ease(seg(t,0.4,0.9));serpent(b,1040,1700,0.9,t,k);randonneur(b,t,760,1000,190,k);JOUR(b);accroche(c,t,d,B,camAt(t,d,{x:820,y:960,z:1.0},{x:840,y:980,z:1.1}),['un serpent te mordait','pendant une randonnée ?']);},
(c,t,d)=>{const [B,b]=sentier(t);const k=ease(seg(t,C('mord',2.6)-0.3,C('mord',2.6)+0.2));serpent(b,1040,1700,0.9,t,k);randonneur(b,t,760,1000,190,k);JOUR(b);show(c,B,camAt(t,d,{x:820,y:960,z:1.0},{x:900,y:1280,z:1.5}));grade(c,t);
  tag(c,'SUR UN SENTIER EUROPÉEN',T1,clamp((t-0.2)/0.3),'sombre',40);tag(c,'UNE MORSURE À LA CHEVILLE',T2,clamp((t-C('mord',2.6))/0.3),'rouge',40);},
(c,t,d)=>{const [B,b]=sentier(t);const k=ease(seg(t,0.2,d-0.3));serpent(b,1040,1700,0.9,t,0);randonneur(b,t,lerp(760,380,k),1000,190,0.6,{walk:k>0.02&&k<0.98?t*1.6:null,look:0.9,mirror:true});JOUR(b);show(c,B,{x:760,y:960,z:1.0});grade(c,t);
  tag(c,'ÉCARTE-TOI DE L’ANIMAL',T1,clamp((t-C('ecarte',0.2))/0.3),'vert',42);tag(c,'N’ESSAIE PAS DE LE CAPTURER',T2,clamp((t-C('capturer',1.8))/0.3),'rouge',38);},
(c,t,d)=>{planche(c,t,t,[['serpent','',0.2,'douleur faible ?'],['secours','oui',C('appelle',2.4)-0.3,'112']],{kicker:'MÊME SI ÇA FAIT PEU MAL',y:860});tag(c,'APPELLE LE 112 IMMÉDIATEMENT',1250,clamp((t-C('appelle',2.4))/0.3),'vert',38);},
(c,t,d)=>{planche(c,t,t,[['allonge','oui',C('allonge',0.6)-0.2,'reste allongé']],{kicker:'EN ATTENDANT',y:820,s:1.8});tag(c,'LIMITE LES MOUVEMENTS DU MEMBRE',1250,clamp((t-C('limite',1.6))/0.3),'vert',36);},
(c,t,d)=>{planche(c,t,t,[['bague','oui',C('bijoux',0.6)-0.2,'retire bijoux et liens']],{kicker:'SI LA ZONE GONFLE',y:820,s:1.8});},
(c,t,d)=>planche(c,t,t,[['garrot','non',C('garrot',0.8)-0.2,'pas de garrot'],['bande','non',C('compressif',2.0)-0.3,'pas de compression']],{kicker:'JAMAIS',y:860}),
(c,t,d)=>planche(c,t,t,[['couteau','non',C('coupe',0.4)-0.2,'ne coupe pas'],['aspirer','non',C('aspirer',2.0)-0.3,'n’aspire pas']],{kicker:'PAS DE GESTES DE FILM',y:860}),
(c,t,d)=>{planche(c,t,t,[['glace','non',C('glace',1.0)-0.3,'pas de glace']],{kicker:'SUR LA MORSURE',y:820,s:1.8});},
(c,t,d)=>planche(c,t,t,[['famille','oui',C('reste',0.2)-0.1,'reste avec elle'],['secours','oui',C('instructions',2.2)-0.3,'suis les secours']],{kicker:'JUSQU’À LEUR ARRIVÉE',y:860}),
(c,t,d)=>fin(c,t,d,[['Écarte-toi, ne capture pas le serpent',PAL.vert],['112 même si ça fait peu mal',PAL.vert],['Allongé, membre immobile, bijoux retirés',PAL.vert],['Ni garrot, ni coupure, ni aspiration, ni glace',PAL.rouge]]),
];
