['alcool','bu','altérer','pression'].forEach(w=>RED_W.add(w));
['monte','organise','boira','sobre','retour','préparation'].forEach(w=>GREEN_W.add(w));
function soiree(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'dehors',T);return [B,b];}
const NUIT=b=>ambiance(b,[{x:1220,y:700,r:900,c:'rgba(255,220,160,0.8)'},{x:600,y:900,r:1200,c:'rgba(160,180,230,0.35)'}],'#3a3e4a');
function ami(b,T,x,y,u,o={}){acteur(b,'ami',x,y,u,{lean:0.05+Math.sin(T*1.5)*0.03,look:0.9,ex:{eye:0.55,brow:0,mouth:0.4},near:o.near||{to:[x+1.0*u,y+0.3*u],hand:'grip',ang:-1.4},far:{bend:-1}},{after:o.cles?f=>{f.save();f.translate(x+1.1*u,y+0.2*u);f.scale(0.35,0.35);ICO.cles(f);f.restore();}:null});}
function toi(b,T,x,y,u,o={}){acteur(b,'heros',x,y,u,{look:1,ex:o.ex||{eye:0.9,brow:0.6,mouth:0.2},near:o.near||{},far:{bend:-1}},{mirror:true,after:o.after});}
const SCENES=[
(c,t,d)=>{const [B,b]=soiree(t);voiture(b,330,1560,0.8,'#c0392b',{});ami(b,t,620,1100,150,{cles:true});toi(b,t,1000,1100,150,{});NUIT(b);accroche(c,t,d,B,camAt(t,d,{x:800,y:1100,z:1.0},{x:820,y:1100,z:1.1}),['ton conducteur','avait bu ?']);},
(c,t,d)=>{const [B,b]=soiree(t);voiture(b,330,1560,0.8,'#c0392b',{});ami(b,t,620,1100,150,{cles:true});toi(b,t,1000,1100,150,{});NUIT(b);show(c,B,{x:820,y:1100,z:1.15});grade(c,t);bubble(c,W/2-120,620,'JE TE RAMÈNE !',clamp((t-1.6)/0.3));
  tag(c,'FIN DE SOIRÉE',T1,clamp((t-0.2)/0.3),'sombre',42);tag(c,'IL A BU DE L’ALCOOL',T2,clamp((t-C('alcool',3.4))/0.3),'rouge',42);},
(c,t,d)=>planche(c,t,t,[['verreBiere','',0.2,'même un peu'],['vertige','',C('reflexes',1.6)-0.3,'réflexes altérés']],{kicker:'L’ALCOOL',y:860}),
(c,t,d)=>{const [B,b]=soiree(t);voiture(b,330,1560,0.8,'#c0392b',{});ami(b,t,620,1100,150,{cles:true});toi(b,t,1000,1100,150,{ex:{eye:0.9,brow:0.2,mouth:0.3},near:{to:[1000-1.0*150,1100+0.3*150],hand:'open',ang:2.6}});NUIT(b);show(c,B,{x:820,y:1100,z:1.15});grade(c,t);bubble(c,W/2+140,620,'NON, MERCI',clamp((t-0.4)/0.3));
  tag(c,'NE MONTE PAS DANS SA VOITURE',T1,clamp((t-C('monte',0.4))/0.3),'rouge',36);tag(c,'ORGANISE UN AUTRE RETOUR',T2,clamp((t-C('organise',2.0))/0.3),'vert',38);},
(c,t,d)=>planche(c,t,t,[['sobre','oui',C('boira',2.0)-0.3,'conducteur sobre'],['taxi','oui',C('boira',2.0)+0.6,'autre retour']],{kicker:'AVANT LA SOIRÉE',y:860}),
(c,t,d)=>{planche(c,t,t,[['cles','oui',C('sobre',2.0)-0.3,'à une personne sobre']],{kicker:'TU AS BU ?',y:820,s:1.8});tag(c,'LAISSE LE VOLANT',1250,clamp((t-C('sobre',2.0)-0.2)/0.3),'vert',44);},
(c,t,d)=>{planche(c,t,t,[['groupe','',0.3,'la pression du groupe']],{kicker:'NE LA LAISSE PAS DÉCIDER',y:820,s:1.8});},
(c,t,d)=>{planche(c,t,t,[['planEcrit','oui',C('retour',0.8)-0.2,'retour prévu']],{kicker:'AUTANT QUE LA SOIRÉE',y:820,s:1.8});},
(c,t,d)=>fin(c,t,d,[['Il a bu : ne monte pas',PAL.rouge],['Même un peu d’alcool altère les réflexes',PAL.rouge],['Prévois un conducteur sobre',PAL.vert],['Le retour se prépare avant la soirée',PAL.vert]]),
];
