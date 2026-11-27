['allergique','gonflement','langue','respiratoire','piqûre'].forEach(w=>RED_W.add(w));
['112','auto-injecteur','adrénaline','notice','surveillance','médecin','trousse','apprends','montre'].forEach(w=>GREEN_W.add(w));
function salon(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'salon',T,{radiateur:false});b.fillStyle='#6a4a32';b.fillRect(300,1380,700,40);return [B,b];}
const AMB=b=>ambiance(b,[LAMPE(760,500,1.1),LAMPE(300,600,0.5)],'#55555e');
const visage=(c,f)=>{c.fillStyle=rgb(PERSOS.heros.skin);c.beginPath();c.arc(0,0,72,0,TAU);c.fill();c.fillStyle=PERSOS.heros.hair;c.beginPath();c.arc(0,-24,74,Math.PI,0);c.fill();c.fillStyle='#222';c.beginPath();c.arc(-24,4,7,0,TAU);c.arc(24,4,7,0,TAU);c.fill();f(c);};
ICO.langue=c=>visage(c,c=>{c.fillStyle='#3a1712';c.beginPath();c.ellipse(0,36,24,18,0,0,TAU);c.fill();c.fillStyle='#e05a6a';c.beginPath();c.ellipse(0,46,22,16,0,0,TAU);c.fill();c.fillStyle='rgba(229,57,53,0.25)';c.beginPath();c.arc(0,10,76,0,TAU);c.fill();});
ICO.souffle=c=>visage(c,c=>{c.fillStyle='#3a1712';c.beginPath();c.ellipse(0,38,14,18,0,0,TAU);c.fill();c.strokeStyle='rgba(200,220,255,0.9)';c.lineWidth=6;for(let i=0;i<3;i++){c.beginPath();c.moveTo(80,10+i*16);c.lineTo(110+i*6,10+i*16);c.stroke();}});
ICO.guepe=c=>{c.fillStyle='#f0c020';c.beginPath();c.ellipse(0,0,70,40,0,0,TAU);c.fill();c.fillStyle='#222';for(const x of [-30,0,30])c.fillRect(x-8,-38,16,76);c.fillStyle='rgba(220,235,255,0.8)';c.beginPath();c.ellipse(-10,-50,30,18,-0.4,0,TAU);c.ellipse(20,-50,30,18,0.4,0,TAU);c.fill();};
ICO.trousse=c=>{c.fillStyle='#d33';c.beginPath();c.roundRect(-90,-60,180,130,20);c.fill();c.fillStyle='#fff';c.fillRect(-14,-40,28,90);c.fillRect(-45,-9,90,28);c.fillStyle='#a22';c.fillRect(-30,-78,60,22);};
ICO.famille=c=>{for(const [x,s,w] of [[-50,1,'heros'],[50,0.95,'femme'],[0,0.7,'enfant']]){c.save();c.translate(x,w==='enfant'?30:0);c.scale(s,s);c.fillStyle=rgb(PERSOS[w].skin);c.beginPath();c.arc(0,-40,30,0,TAU);c.fill();c.fillStyle=rgb(PERSOS[w].shirt);c.beginPath();c.roundRect(-34,-6,68,80,24);c.fill();c.restore();}};
function malade(b,T,k,o={}){return acteur(b,'heros',640,880,210,{lean:0.04*k,look:0.6,ex:{eye:lerp(0.7,1,k),brow:0.9*k,mouth:0.6*k},near:o.near||{to:[640+0.75*210,880+0.1*210],hand:'grip',ang:-2.6},far:o.far||{bend:-1}});}
const SCENES=[
(c,t,d)=>{const [B,b]=salon(t);const k=ease(seg(t,0.2,1.0));malade(b,t,k);AMB(b);accroche(c,t,d,B,camAt(t,d,{x:700,y:900,z:1.4},{x:710,y:880,z:1.55}),['tu faisais une réaction','allergique grave ?']);},
(c,t,d)=>planche(c,t,t,[['pomme','',C('repas',0.6)-0.2,'un repas'],['guepe','',C('piqure',1.4)-0.2,'une piqûre']],{kicker:'APRÈS…',y:860}),
(c,t,d)=>{planche(c,t,t,[['langue','',C('langue',1.4)-0.2,'langue qui gonfle'],['souffle','',C('respiratoire',2.6)-0.2,'mal à respirer']],{kicker:'SIGNES D’ALERTE',y:860});tag(c,'C’EST UNE URGENCE',1250,clamp((t-C('alerter',3.6))/0.3),'rouge',46);},
(c,t,d)=>{const [B,b]=salon(t);malade(b,t,1);acteur(b,'femme',1140,900,190,{look:1,ex:{eye:0.9,brow:0.6,mouth:0.4},near:{to:[1140+1.45*190,900+0.6*190],hand:'grip',ang:-1.3}},{mirror:true,after:f=>phone(f,1140+1.45*190+Math.cos(-1.3)*0.34*190,900+0.6*190+Math.sin(-1.3)*0.34*190,-0.12,t,1.0)});
  AMB(b);show(c,B,{x:880,y:1060,z:1.0});grade(c,t);tag(c,'APPELLE IMMÉDIATEMENT LE 112',T1,clamp((t-C('appelle',0.2))/0.3),'vert',40);tag(c,'OU FAIS-LE FAIRE',T2,clamp((t-C('demande',1.8))/0.3),'vert',42);},
(c,t,d)=>{planche(c,t,t,[['stylo','oui',C('auto',1.2)-0.2,'auto-injecteur']],{kicker:'S’IL T’A ÉTÉ PRESCRIT',y:820,s:1.8});tag(c,'UTILISE-LE SANS ATTENDRE',1250,clamp((t-C('attendre',2.6))/0.3),'vert',42);tag(c,'SELON SES INSTRUCTIONS',1340,clamp((t-C('instructions',3.4))/0.3),'jaune',38);},
(c,t,d)=>{planche(c,t,t,[['stylo','',0.2,'modèle A'],['notice','oui',C('notice',2.2)-0.2,'notice']],{kicker:'CHAQUE DISPOSITIF EST DIFFÉRENT',y:860});tag(c,'SUIS LA NOTICE ET TA FORMATION',1250,clamp((t-C('notice',2.2))/0.3),'vert',38);},
(c,t,d)=>{planche(c,t,t,[['hopital','oui',C('surveillance',2.4)-0.2,'surveillance médicale']],{kicker:'MÊME SI ÇA VA MIEUX',y:820,s:1.8});tag(c,'INDISPENSABLE',1250,clamp((t-C('indispensable',3.2))/0.3),'rouge',46);},
(c,t,d)=>{const [B,b]=salon(t);malade(b,t,0.5,{near:{bend:1}});acteur(b,'femme',1140,900,190,{look:1,ex:{eye:0.8,brow:0.3,mouth:0.2},near:{to:[1140+1.45*190,900+0.6*190],hand:'grip',ang:-1.3}},{mirror:true,after:f=>phone(f,1140+1.45*190+Math.cos(-1.3)*0.34*190,900+0.6*190+Math.sin(-1.3)*0.34*190,-0.12,t,1.0)});
  AMB(b);show(c,B,{x:880,y:1060,z:1.0});grade(c,t);tag(c,'NE RESTE PAS SEUL',T1,clamp((t-0.1)/0.3),'vert',46);tag(c,'SUIS LES INSTRUCTIONS DE L’OPÉRATEUR',T2,clamp((t-C('suis',1.0))/0.3),'vert',34);},
(c,t,d)=>{planche(c,t,t,[['pharmacien','',0.2,'ton médecin'],['trousse','oui',C('trousse',2.0)-0.2,'trousse d’urgence']],{kicker:'À PRÉPARER',y:860});},
(c,t,d)=>{planche(c,t,t,[['stylo','oui',0.2,'apprends'],['famille','oui',C('montre',1.8)-0.2,'montre à tes proches']],{kicker:'ENTRAÎNE-TOI',y:860});},
(c,t,d)=>fin(c,t,d,[['Langue qui gonfle, mal à respirer',PAL.rouge],['112 tout de suite',PAL.vert],['Auto-injecteur prescrit : sans attendre',PAL.vert],['Surveillance médicale même si ça va',PAL.vert]]),
];
