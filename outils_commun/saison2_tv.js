// Décors et accessoires originaux des fables fictives de la saison 2.
// Réutilise les fonctions de dessin et les personnages du modèle historique.
function s2rect(c,x,y,w,h,col,edge='#37332f',r=3){c.fillStyle=col;c.fillRect(x,y,w,h);c.strokeStyle=edge;c.lineWidth=r;c.strokeRect(x,y,w,h);}
function s2text(c,x,y,s,sz=30,col='#211e1b',max=900){c.save();c.font='bold '+sz+'px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillStyle=col;c.fillText(s,x,y,max);c.restore();}
function s2line(c,x,y,a,b,col='#49433d',w=4){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();}
function s2circle(c,x,y,r,col){F(c,ell(x,y,r,r),col,3);}
function s2sign(c,x,y,w,h,label){s2rect(c,x,y,w,h,'#e9e1cf','#423c34',5);s2rect(c,x+8,y+8,w-16,h-16,'#ded6c7','#82786a',2);s2text(c,x+w/2,y+h/2,label,28,'#211e1b',w-20);}
function s2back(c,t,k){
 if(['drawers','bell','prices','sale'].includes(k)){placeNB(c,t,{});return;}
 c.fillStyle='#cfc9be';c.fillRect(0,0,W,H);
 for(let x=35;x<W;x+=150)s2rect(c,x,40,125,530,'#c4beb3','#aaa398',2);
 for(let x=0;x<W;x+=135){s2rect(c,x,580,135,230,'#9c958a','#7e786d',2);s2line(c,x,690,x+135,690,'#8a8277',2);}
 if(k==='stage'){for(let i=0;i<8;i++){s2rect(c,i*45,0,46,580,i%2?'#4c4642':'#6d6560');s2rect(c,W-360+i*45,0,46,580,i%2?'#4c4642':'#6d6560');}}
 else{for(const x of [85,805]){s2rect(c,x,135,190,270,'#5c554b','#423c34',6);s2rect(c,x+12,147,166,246,'#e5dfd2');s2line(c,x+95,147,x+95,393);s2line(c,x+12,270,x+178,270);}s2rect(c,0,550,W,24,'#62594e');}
}
function s2counter(c){s2rect(c,330,620,420,122,'#817466','#3b342d',5);for(let i=0;i<3;i++)s2rect(c,346+i*140,642,116,78,'#9a8b78','#52483e',3);s2rect(c,315,606,450,20,'#b0a18c','#4b4035',5);}
function s2person(c,t,x,merchant,id,look=1,move=0,scale=.49){
 const P=figurant(t,x,merchant?2:1,{s:scale,y:790,face:look,look:[look*.7,0],chapeau:merchant?COIFFE.kepi:COIFFE.foulard,handR:[90+Math.sin(t*3)*25,-480-move*110],poseR:move?'ouverte':'poing'});
 if(id&&L[id])voix(P,[id],t);dessine(c,P);
}
function s2modern(c,t,stage){
 c.fillStyle='#d1ccc2';c.fillRect(0,0,W,H);
 s2rect(c,315,48,450,716,'#292726','#181614',9);s2rect(c,336,82,408,630,'#f4f1eb','#625d54',3);
 s2text(c,540,124,'AUJOURD’HUI',30);
 for(let i=0;i<4;i++){const y=185+i*115,active=i===stage;s2rect(c,365,y,350,86,active?'#57534d':'#ded9cd','#867f73');s2text(c,540,y+43,S2.modern[i],26,active?'#ffffff':'#25211c',320);}
 s2circle(c,540,738,12,'#77716a');
 if(S2.kind==='bell'&&stage<2){s2circle(c,707,182,20,'#4a4541');s2text(c,707,182,'27',16,'#fff');}
}
function s2props(c,t,stage,u){
 const k=S2.kind,n=Math.min(3,Math.floor((stage+1)/3));
 if(k==='objet'){s2counter(c);objetFable(c,S2.numero,t,stage,u);
 }else if(k==='drawers'){
  s2rect(c,355,245,370,365,'#857564','#46392b',5);
  for(let i=0;i<9;i++){let x=370+i%3*115,y=270+Math.floor(i/3)*100,o=i===stage%9?u:0;s2rect(c,x,y,108,80,'#b6a58e');s2rect(c,x-16*o,y+14*o,108,65,o>.1?'#dfd3ba':'#a69278');s2circle(c,x+54-16*o,y+40+14*o,8,'#44372b');if(o>.4){if(stage%3===0)s2circle(c,x+52,y+32,15,'#ddd4bc');else if(stage%3===1)s2line(c,x+24,y+24,x+80,y+53,'#4d4032',5);}}
 }else if(k==='bell'){
  c.save();c.translate(540,390);c.rotate(Math.sin(t*10)*.17*([2,5,8].includes(stage)?1:.15));F(c,smooth([[-95,95],[-70,65],[-62,-38],[-22,-74],[22,-74],[62,-38],[70,65],[95,95]]),'#b8aa86',5);F(c,ell(0,95,95,18),'#7e6c50',5);s2circle(c,0,115,19,'#484039');s2line(c,0,-70,0,-124,'#494036',12);c.restore();
 }else if(k==='stage'){
  s2rect(c,375,250,330,300,'#b9b0a2','#4c443d',4);
  for(let i=0;i<5;i++){const w=28+(1-u)*8;s2rect(c,375+i*29,250,w,300,'#625852');s2rect(c,705-(i+1)*29,250,w,300,'#625852');}
  s2sign(c,430,305,220,70,stage===0?'FIN':'LA SUITE');
  for(let i=0;i<3;i++){s2circle(c,420+120*i,580,24,'#a59b8e');s2rect(c,388+120*i,603,64,80,'#5a534a');}
 }else if(k==='stamps'){
  s2rect(c,365,285,350,285,'#e4d9bd','#5b5041',5);s2line(c,540,290,540,566);
  for(let i=0;i<30;i++){let x=385+i%6*54,y=320+Math.floor(i/6)*46,count=stage>=6?0:Math.min(30,(stage+1)*6);s2rect(c,x,y,41,34,'#f0e6d2');if(i<count){s2circle(c,x+20,y+17,12,'#736657');s2text(c,x+20,y+17,'✓',20,'#eee6d5');}}
  if(stage===5){c.save();c.globalAlpha=u;s2sign(c,390,403,300,73,'ANNULÉ');c.restore();}
 }else if(k==='doors'){
  s2rect(c,335,210,260,400,'#787064');s2rect(c,360,233,210,377,'#d9cdb5');for(let i=0;i<4;i++)s2rect(c,370+i*47,260,40,325,'#a89a81');s2circle(c,550,425,9,'#42372b');s2rect(c,630,405,88,205,'#918572');s2circle(c,700,510,6,'#44372d');s2sign(c,345,152,240,52,'ENTRÉE');s2sign(c,610,359,125,42,'AUTRE');
 }else if(k==='maze'){
  s2rect(c,345,255,390,340,'#e0d7c5');for(const z of [[390,270,390,510],[390,510,575,510],[575,510,575,310],[470,310,575,310],[470,310,470,420],[470,420,670,420],[670,420,670,570],[610,570,670,570]])s2line(c,...z,'#52483c',18);
  const pos=[[360,285],[430,540],[625,470],[615,585]][n];s2circle(c,pos[0],pos[1],15,'#8b6c4a');s2sign(c,360,205,160,45,'ENTRÉE');s2sign(c,580,602,170,45,'SORTIE ?');
 }else if(k==='bill'){
  s2counter(c);F(c,ell(445,590,73,20),'#e8e0ce',4);F(c,ell(445,584,45,12),'#a99776',3);s2line(c,565,582,565,505,'#a59778',14);F(c,ell(565,495,8,18),'#e8d4a6',2);
  s2rect(c,600,270,110,stage<4?120:120+u*150,'#f2e9d8');['REPAS 10','CHAISE','BOUGIE','TOTAL'].slice(0,Math.min(4,1+n)).forEach((a,i)=>s2text(c,655,300+i*42,a,13));
 }else if(k==='prices'||k==='sale'){
  s2counter(c);for(let i=0;i<3;i++){const x=420+120*i;
   if(k==='prices'){F(c,smooth([[x-45,555],[x+45,555],[x+32,620],[x-32,620]]),'#b5a186',4);for(let j=0;j<4;j++)s2line(c,x-35,568+j*12,x+35,568+j*12,'#89775f',2);c.beginPath();c.strokeStyle='#6b5844';c.lineWidth=7;c.arc(x,555,32,Math.PI,0);c.stroke();}
   else{F(c,ell(x,605,54,13),'#5d5146',4);F(c,smooth([[x-30,602],[x-25,552],[x+25,552],[x+30,602]]),'#93816c',3);s2rect(c,x-29,587,58,10,'#3f3830');}
   s2sign(c,x-45,480,90,56,k==='sale'?(stage<2?'50 F':stage<4?'100 F':'50 F'):(n===0?'5 F':i===0?'5 F':'8 F'));}
  if(k==='sale'&&stage>=4)s2sign(c,400,310,280,90,'-50 %');
 }else if(k==='queue'){
  s2counter(c);s2rect(c,365,250,350,250,'#938676');for(let i=0;i<5;i++){const x=405+i*66;s2line(c,x,285,x,335);s2circle(c,x,345,12,'#c6b38f');s2line(c,x,355,x,410,'#b4a17b',9);s2line(c,x,395,x+14,395,'#b4a17b',7);}
  if(stage>=3)s2sign(c,440,460,200,60,'1 CHAMBRE');
 }
 s2sign(c,370,135,340,63,S2.labels[n]);
}
function s2Fable(c,t,u,stage,id){
 if([13,14,16,17].includes(stage)){s2modern(c,t,stage===13?0:stage===14?1:stage===16?2:3);return;}
 s2back(c,t,S2.kind);s2sign(c,305,28,470,78,S2.place);s2props(c,t,stage,u);
 const m=id==='s05a'||id==='s09b',v=id==='s07a',move=[2,5,8].includes(stage)?1:0;
 if(stage===7)s2person(c,t,795,false,v?id:null,-1,1,.46);
 else if([8,15,18].includes(stage))s2person(c,t,875,true,m?id:null,-1,move,.43);
 else{s2person(c,t,215+([4,6].includes(stage)?u*30:0),false,null,1,move,.48);s2person(c,t,855,true,m?id:null,-1,move,.5);}
 if(S2.kind==='queue'&&[3,4,5].includes(stage)){s2person(c,t,115,false,null,1,0,.31);s2person(c,t,310,false,null,1,0,.33);}
}

