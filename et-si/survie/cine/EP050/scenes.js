['glace','verglas','brusques','brutaux','contrôle'].forEach(w=>RED_W.add(w));
['modère','distance','prépare','reporter'].forEach(w=>GREEN_W.add(w));
function vue(c,t,o,cam){const [B]=vueConducteur(t,o);show(c,B,cam||{x:WB/2,y:H/2,z:1});grade(c,t);}
const SCENES=[
(c,t,d)=>{const [B]=vueConducteur(t,{verglas:true,hiver:true,devant:0.35,kmh:90});accroche(c,t,d,B,camAt(t,d,{x:WB/2,y:H/2,z:1.0},{x:WB/2,y:880,z:1.1}),['la route devenait','verglacée ?']);},
(c,t,d)=>{vue(c,t,{verglas:t>C('glace',3.6)-0.4,hiver:true,kmh:90});tag(c,'LA ROUTE SEMBLE HUMIDE',T1,clamp((t-C('humide',1.6))/0.3),'sombre',40);tag(c,'EN RÉALITÉ : DE LA GLACE',T2,clamp((t-C('glace',3.6))/0.3),'rouge',40);},
(c,t,d)=>{vue(c,t,{verglas:true,hiver:true,pont:true,kmh:90});tag(c,'PONTS ET ZONES D’OMBRE',T1,clamp((t-C('ponts',0.6))/0.3),'jaune',40);tag(c,'LE VERGLAS S’Y FORME',T2,clamp((t-2.8)/0.3),'rouge',42);},
(c,t,d)=>{const k=ease(seg(t,0.2,2.0));vue(c,t,{verglas:true,hiver:true,kmh:Math.round(lerp(90,60,k)),vitesse:lerp(1.2,0.8,k)});tag(c,'MODÈRE TON ALLURE AVANT',T1,clamp((t-C('modere',0.2))/0.3),'vert',40);tag(c,'RISQUE DE PERDRE LE CONTRÔLE',T2,clamp((t-C('controle',3.6))/0.3),'rouge',36);},
(c,t,d)=>{const k=ease(seg(t,0.2,d-0.4));vue(c,t,{verglas:true,hiver:true,devant:lerp(0.45,0.25,k),kmh:60});tag(c,'PLUS DE DISTANCE',T1,clamp((t-C('distance',0.6))/0.3),'vert',46);},
(c,t,d)=>planche(c,t,t,[['retenir','non',C('volant',0.8)-0.2,'volant brusque'],['detresse','non',C('brutaux',2.6)-0.3,'freinage brutal']],{kicker:'ÉVITE',y:860}),
(c,t,d)=>{vue(c,t,{verglas:true,hiver:true,kmh:50,volant:0.1*Math.sin(t)});tag(c,'PRÉPARE TES CHANGEMENTS D’ALLURE',T1,clamp((t-C('prepare',0.2))/0.3),'vert',34);tag(c,'SURTOUT AVANT LES VIRAGES',T2,clamp((t-C('virages',2.4))/0.3),'vert',38);},
(c,t,d)=>{planche(c,t,t,[['verglasIco','',0.2,'conditions extrêmes'],['calendrier','oui',C('reporter',2.4)-0.3,'reporte le voyage']],{kicker:'LA DÉCISION LA PLUS SÛRE',y:860});},
(c,t,d)=>fin(c,t,d,[['Humide + froid : pense au verglas',PAL.rouge],['Ponts et zones d’ombre : ralentis',PAL.vert],['Distance doublée, gestes doux',PAL.vert],['Conditions extrêmes : reporte',PAL.vert]]),
];
