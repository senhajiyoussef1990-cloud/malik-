['eau','adhèrent','brusques','dangereux'].forEach(w=>RED_W.add(w));
['réduis','augmente','espace','anticipe','interromps-le','sûr'].forEach(w=>GREEN_W.add(w));
function vue(c,t,o,cam){const [B]=vueConducteur(t,o);show(c,B,cam||{x:WB/2,y:H/2,z:1});grade(c,t);}
const SCENES=[
(c,t,d)=>{const [B]=vueConducteur(t,{pluie:true,devant:0.35,kmh:110,vitesse:1.8});accroche(c,t,d,B,camAt(t,d,{x:WB/2,y:H/2,z:1.0},{x:WB/2,y:880,z:1.12}),['une pluie torrentielle','réduisait ta visibilité ?']);},
(c,t,d)=>{vue(c,t,{pluie:true,devant:0.3,kmh:110,vitesse:1.8});tag(c,'LE CIEL S’ASSOMBRIT',T1,clamp((t-C('sombre',1.6))/0.3),'sombre',42);tag(c,'LA CHAUSSÉE SE COUVRE D’EAU',T2,clamp((t-C('eau',3.6))/0.3),'rouge',38);},
(c,t,d)=>planche(c,t,t,[['pneu','',C('adherent',1.4)-0.3,'moins d’adhérence'],['distance','',C('espace',3.6)-0.4,'freinage plus long']],{kicker:'ROUTE MOUILLÉE',y:860}),
(c,t,d)=>{const k=ease(seg(t,C('reduis',0.2),C('reduis',0.2)+2));vue(c,t,{pluie:true,devant:0.3,kmh:Math.round(lerp(110,70,k)),vitesse:lerp(1.8,1,k)});tag(c,'RÉDUIS TA VITESSE',T1,clamp((t-C('reduis',0.2))/0.3),'vert',44);tag(c,'LA LIMITE N’EST PAS UN OBJECTIF',T2,clamp((t-C('limitation',2.8))/0.3),'jaune',36);},
(c,t,d)=>{const k=ease(seg(t,0.2,d-0.4));vue(c,t,{pluie:true,devant:lerp(0.45,0.25,k),kmh:70});tag(c,'AUGMENTE L’ESPACE',T1,clamp((t-C('augmente',0.2))/0.3),'vert',44);tag(c,'PLUS DE TEMPS POUR RÉAGIR',T2,clamp((t-2.4)/0.3),'vert',40);},
(c,t,d)=>{vue(c,t,{pluie:true,devant:0.3,kmh:70,frein:Math.sin(t*2)>0.6});tag(c,'ANTICIPE LES RALENTISSEMENTS',T1,clamp((t-C('anticipe',0.2))/0.3),'vert',38);tag(c,'PAS DE GESTES BRUSQUES',T2,clamp((t-C('brusques',2.6))/0.3),'rouge',40);},
(c,t,d)=>{vue(c,t,{pluie:true,devant:0.25,kmh:70});tag(c,'NE SUIS PAS LE RYTHME DES AUTRES',T1,clamp((t-C('suivre',0.8))/0.3),'rouge',34);tag(c,'SI TU NE VOIS PAS ASSEZ LOIN',T2,clamp((t-2.0)/0.3),'jaune',38);},
(c,t,d)=>{planche(c,t,t,[['parking','oui',C('interromps',4.0)-0.6,'endroit autorisé et sûr']],{kicker:'TROP DANGEREUX ?',y:820,s:1.8});tag(c,'INTERROMPS TON TRAJET',1250,clamp((t-C('interromps',4.0))/0.3),'vert',42);},
(c,t,d)=>fin(c,t,d,[['Route mouillée : freinage plus long',PAL.rouge],['Ralentis selon la visibilité',PAL.vert],['Plus de distance, pas de gestes brusques',PAL.vert],['Trop dangereux : arrête-toi en sécurité',PAL.vert]]),
];
