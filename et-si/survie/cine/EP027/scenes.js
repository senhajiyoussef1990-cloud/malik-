['éclat','violemment','douleur','trouble','pénétrer','globe','extraire','intense','altérée'].forEach(w=>RED_W.add(w));
['consultation','urgente','ophtalmologique','explique','matériau','examens'].forEach(w=>GREEN_W.add(w));
function atelier(T){const B=buf('w',WB,H),b=B.getContext('2d');decor(b,'atelier',T);return [B,b];}
const AMB=b=>ambiance(b,[LAMPE(800,400,1.1),{x:870,y:1060,r:700,c:'rgba(255,190,90,0.5)'}],'#6a6660');
function etincelles(c,x,y,T,a=1,vers=null){if(a<=0)return;c.save();c.globalCompositeOperation='lighter';for(let i=0;i<26;i++){const r=mulberry(i),p=((T*1.6+r())%1);const ang=-Math.PI*0.75+r()*0.9,v=180+r()*260;
  const px=vers&&i===0?lerp(x,vers[0],clamp(p*1.4)):x+Math.cos(ang)*v*p,py=vers&&i===0?lerp(y,vers[1],clamp(p*1.4)):y+Math.sin(ang)*v*p+200*p*p;c.fillStyle=`rgba(255,${200-p*100|0},80,${a*(1-p)})`;c.beginPath();c.arc(px,py,i===0&&vers?9:4,0,TAU);c.fill();}c.restore();}
function bricoleur(b,T,x,y,u,k){const E=[x+0.92*u,y-0.55*u];acteur(b,'heros',x,y,u,{lean:0.1-0.15*k,look:0.85,ex:{eye:lerp(0.8,0.15,k),brow:0.9*k,mouth:0.5*k},near:k>0.5?{to:E,hand:'open',ang:-2.4}:{to:[860,1030],hand:'grip',ang:0},far:k>0.5?{bend:-1}:{to:[820,1060],hand:'grip',bend:-1}});return E;}
const SCENES=[
(c,t,d)=>{const [B,b]=atelier(t);const k=ease(seg(t,0.6,1.1));const E=bricoleur(b,t,500,850,170,k);AMB(b);const cam=camAt(t,d,{x:680,y:900,z:1.1},{x:680,y:890,z:1.15});accroche(c,t,d,B,cam,['un éclat de métal','frappait ton œil ?']);c.save();camXf(c,cam);etincelles(c,870,1030,t,1-k*0.7,t<0.9?E:null);c.restore();},
(c,t,d)=>{const [B,b]=atelier(t);const k=ease(seg(t,C('eclat',1.0)+0.6,C('eclat',1.0)+1.0));const E=bricoleur(b,t,500,850,170,k);AMB(b);const cam={x:700,y:920,z:1.25};show(c,B,cam);grade(c,t);c.save();camXf(c,cam);etincelles(c,870,1030,t,1-k*0.7,k<1?E:null);c.restore();
  tag(c,'EN BRICOLANT',T1,clamp((t-0.1)/0.3),'sombre',42);tag(c,'UN ÉCLAT PROJETÉ VERS TON VISAGE',T2,clamp((t-C('eclat',1.0))/0.3),'rouge',36);},
(c,t,d)=>planche(c,t,t,[['choc','',C('douleur',1.0)-0.2,'douleur soudaine'],['oeil','',C('vision',2.0)-0.2,'vision trouble']],{kicker:'BLESSURE SÉRIEUSE POSSIBLE',y:860}),
(c,t,d)=>{planche(c,t,t,[['eclat','',0.2,'fragment']],{kicker:'ATTENTION',y:820,s:1.8});tag(c,'IL PEUT PÉNÉTRER DANS L’ŒIL',1250,clamp((t-C('globe',2.0)+0.2)/0.3),'rouge',40);},
(c,t,d)=>planche(c,t,t,[['cil','',0.2,'un simple cil'],['eclat','',C('cil',2.0)-0.4,'un éclat projeté']],{kicker:'CE N’EST PAS LA MÊME CHOSE',y:860}),
(c,t,d)=>{planche(c,t,t,[['pince','non',0.3,'ne l’extrais pas']],{kicker:'FRAGMENT PÉNÉTRANT',y:820,s:1.8});tag(c,'NE TENTE PAS DE LE RETIRER TOI-MÊME',1250,clamp((t-C('extraire',1.4))/0.3),'rouge',34);},
(c,t,d)=>{planche(c,t,t,[['hopital','oui',C('urgente',2.2)-0.3,'ophtalmologue']],{kicker:'PROJECTION VIOLENTE',y:820,s:1.8});tag(c,'CONSULTATION URGENTE',1250,clamp((t-C('urgente',2.2))/0.3),'vert',44);},
(c,t,d)=>{planche(c,t,t,[['choc','',C('intense',0.8)-0.2,'douleur intense'],['oeil','',C('vision',2.0)-0.2,'vision altérée']],{kicker:'AUTRES MOTIFS D’URGENCE',y:860});},
(c,t,d)=>planche(c,t,t,[['eclat','oui',C('materiau',1.4)-0.3,'le matériau'],['notice','oui',C('materiau',1.4)+0.6,'les circonstances']],{kicker:'EXPLIQUE AU MÉDECIN',y:860}),
(c,t,d)=>planche(c,t,t,[['imagerie','oui',C('examens',0.4)-0.2,'examens'],['hopital','oui',C('intervention',2.0)-0.3,'parfois une intervention']],{kicker:'À L’HÔPITAL',y:860}),
(c,t,d)=>fin(c,t,d,[['Douleur, vision trouble : urgence',PAL.rouge],['N’extrais jamais un fragment',PAL.rouge],['Ophtalmologue en urgence',PAL.vert],['Dis le matériau et les circonstances',PAL.vert]]),
];
