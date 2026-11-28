['vibre','quitte','obstacle','soixante-dix','détourner'].forEach(w=>RED_W.add(w));
['mode','conduite','range','passager','pause','stationnement'].forEach(w=>GREEN_W.add(w));
function vue(c,t,o,cam){const [B]=vueConducteur(t,o);show(c,B,cam||{x:WB/2,y:H/2,z:1});grade(c,t);}
function regardTel(c,a){if(a<=0)return;c.save();c.globalAlpha=a*0.55;c.fillStyle='#000';c.fillRect(0,0,W,H);c.restore();}
const SCENES=[
(c,t,d)=>{const [B]=vueConducteur(t,{tel:'notif',devant:0.3,kmh:50});accroche(c,t,d,B,camAt(t,d,{x:WB/2,y:H/2,z:1.0},{x:WB/2+120,y:1000,z:1.15}),['un SMS','te faisait manquer','un obstacle ?']);},
(c,t,d)=>{const k=ease(seg(t,C('chaussee',3.6)-0.6,C('chaussee',3.6)+0.2));vue(c,t,{tel:'notif',devant:lerp(0.3,0.5,seg(t,1,d)),frein:t>2,kmh:50},camAt(t,d,{x:WB/2,y:H/2,z:1.0},{x:VX+375,y:1385,z:2.4},x=>ease(k)));tag(c,'TON TÉLÉPHONE VIBRE',T1,clamp((t-C('vibre',0.6))/0.3),'jaune',42);tag(c,'TON REGARD QUITTE LA ROUTE',T2,clamp((t-C('chaussee',3.6))/0.3),'rouge',38);},
(c,t,d)=>{darkBg(c);kicker(c,'À 50 KM/H',300,1);c.save();c.font='900 150px M';c.fillStyle=PAL.etsi;c.textAlign='center';c.globalAlpha=clamp((t-C('cinq',1.6))/0.3);c.fillText('5 s',W/2,800);c.globalAlpha=clamp((t-C('soixantedix',3.4))/0.3);c.fillStyle=PAL.rouge;c.fillText('≈ 70 m',W/2,1000);c.restore();
  c.save();c.globalAlpha=clamp((t-C('soixantedix',3.4))/0.3);dashArrow(c,[[200,1150],[880,1150]],seg(t,C('soixantedix',3.4),C('soixantedix',3.4)+1.2),PAL.rouge,10);c.restore();grade(c,t,{vig:0.45});tag(c,'À L’AVEUGLE',1300,clamp((t-C('soixantedix',3.4)-0.6)/0.3),'rouge',44);},
(c,t,d)=>{const k=ease(seg(t,0.3,d));vue(c,t,{devant:lerp(0.25,0.75,k),frein:true,kmh:50});regardTel(c,1-k);tag(c,'UN OBSTACLE APPARAÎT',T1,clamp((t-C('obstacle',1.4))/0.3),'rouge',42);tag(c,'TU NE L’AS PAS VU',T2,clamp((t-2.4)/0.3),'rouge',42);},
(c,t,d)=>planche(c,t,t,[['mainsLibres','',C('libres',1.4)-0.3,'kit mains libres'],['confusion','',C('libres',1.4)+0.8,'attention détournée']],{kicker:'MÊME UNE CONVERSATION',y:860}),
(c,t,d)=>{planche(c,t,t,[['modeConduite','oui',C('conduite',2.2)-0.3,'mode conduite']],{kicker:'AVANT DE DÉMARRER',y:820,s:1.8});tag(c,'MOINS DE NOTIFICATIONS',1250,clamp((t-C('conduite',2.2)+0.6)/0.3),'vert',42);},
(c,t,d)=>planche(c,t,t,[['smartphone','oui',C('range',0.2)-0.1,'hors de portée'],['groupe','oui',C('passager',2.0)-0.3,'confié au passager']],{kicker:'TON TÉLÉPHONE',y:860}),
(c,t,d)=>{planche(c,t,t,[['parking','oui',C('pause',1.4)-0.3,'à l’arrêt, en lieu sûr']],{kicker:'POUR LIRE TES MESSAGES',y:820,s:1.8});},
(c,t,d)=>fin(c,t,d,[['5 s sans regarder = 70 m à l’aveugle',PAL.rouge],['Même le mains libres distrait',PAL.rouge],['Mode conduite, téléphone rangé',PAL.vert],['Messages : seulement à l’arrêt',PAL.vert]]),
];
