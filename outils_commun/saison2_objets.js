// Accessoires des fables de la seconde moitié de saison. Origine au centre du comptoir.
function objetFable(c, n, t, phase, u) {
  c.save(); c.translate(540, 455);
  const clair='#eee5cd', moyen='#aa9a82', fonce='#514538', noir='#322e2a';
  const rect=(x,y,w,h,col=clair)=>s2rect(c,x,y,w,h,col,noir,4);
  const rond=(x,y,r,col=clair)=>s2circle(c,x,y,r,col);
  const trait=(x,y,a,b,w=5,col=fonce)=>s2line(c,x,y,a,b,col,w);
  const forme=(points,col)=>F(c,poly(points),col,4);
  const mot=(x,y,txt,sz=24,max=390)=>s2text(c,x,y,txt,sz,noir,max);
  const ellipse=(x,y,rx,ry,col)=>F(c,ell(x,y,rx,ry),col,4);
  const p=Math.min(3,Math.floor((phase+1)/3)), nudge=Math.sin(t*2)*3;
  function papier(x,y,w,h){rect(x,y,w,h);for(let j=0;j<3;j++)trait(x+15,y+h*.55+j*12,x+w-16,y+h*.55+j*12,2);}
  function lampe(x,y){ellipse(x,y+70,48,12,moyen);forme([[x-32,y+58],[x-12,y+10],[x-19,y-35],[x+19,y-35],[x+12,y+10],[x+32,y+58]],clair);ellipse(x,y+12,13,22,'#d7b272');}
  function roue(x,y){rond(x,y,44,fonce);rond(x,y,36,clair);for(let j=0;j<6;j++){let a=j*Math.PI/3+u*.18;trait(x,y,x+36*Math.cos(a),y+36*Math.sin(a),3);}rond(x,y,7,fonce);}
  function visage(x,y,nez){ellipse(x,y,49,65,clair);ellipse(x-15,y-12,4,5,noir);ellipse(x+15,y-12,4,5,noir);forme([[x,y-10],[x+nez,y+14],[x-3,y+15]],moyen);trait(x-12,y+34,x+13,y+32,3);}
  function bouteille(x,y){rect(x-11,y-76,22,28,moyen);forme([[x-12,y-50],[x-32,y-28],[x-32,y+56],[x+32,y+56],[x+32,y-28],[x+12,y-50]],clair);rect(x-27,y+10,54,39,moyen);}
  function journal(x,y,titre){papier(x,y,150,145);mot(x+75,y+32,titre,17,136);rect(x+15,y+48,65,25,moyen);}
  function panier(x,y){forme([[x-53,y],[x+53,y],[x+37,y+47],[x-37,y+47]],moyen);c.beginPath();c.arc(x,y,37,Math.PI,2*Math.PI);c.stroke();}
  switch(n){
    case 61: forme([[-148,-92],[-85,-92],[-86,5],[-37,19],[-28,48],[-150,48]],fonce); papier(0,-103,150,168);for(let i=0;i<4;i++){rect(13+i*31,-52,24,24);if(i<=p)mot(25+i*31,-40,'×',24);}break;
    case 62: roue(-95,40);roue(48,40);forme([[-161,-90],[108,-90],[75,-5],[-125,-5]],moyen);trait(78,-28,174,-60,10);mot(-18,-55,'1 SOU / JOUR',20);break;
    case 63: lampe(-80,-15);bouteille(80,0);mot(80,25,p?'HUILE':'?',17,50);break;
    case 64: ellipse(-35,18,105,20,fonce);forme([[-103,5],[-82,-75],[8,-75],[32,5]],moyen);rond(96,-135+nudge,36,clair);for(let i=0;i<4;i++)trait(-130+i*29,-160+u*40,-137+i*29,-138+u*40,2);break;
    case 65: ellipse(-80,35,42,48,moyen);trait(-80,-4,-80,-78);forme([[-82,-70],[-120,-107],[-94,-92],[-80,-118],[-67,-89],[-42,-108],[-63,-70]],clair);papier(20,-62,131,110);mot(82,-37,['5 F','10 F','20 F','?'][p]);break;
    case 66: for(let j=0;j<3;j++){panier((j-1)*110,34); for(let k=0;k<(j===2&&p>1?0:(j+1)%3+1);k++)ellipse((j-1)*110-13+k*24,20,14,22,clair);}break;
    case 67: papier(-140,-112,215,166);for(let j=0;j<3;j++)mot(-105+j*49,-68+j%2*25,'×',30);forme([[65,32],[96,-9],[136,6],[156,38],[133,62],[72,59]],'#c2a66e');break;
    case 68: rond(-35,-18,90,moyen);for(let j=0;j<12;j++){let a=j*Math.PI/6+u;trait(-35,-18,-35+86*Math.cos(a),-18+86*Math.sin(a),3);}forme([[-49,-127],[-20,-127],[-35,-102]],noir);rond(112,38,32,clair);mot(112,38,p?'1 F':'OFFERT',16,54);break;
    case 69: for(let j=0;j<3;j++){let x=-124+j*90;rect(x,-94,75,106,moyen);mot(x+38,-41,'?',39);}for(let j=0;j<=p;j++){rond(-87+j*56,61,23,clair);rond(-93+j*56,61,3,noir);rond(-81+j*56,61,3,noir);}break;
    case 70: papier(-144,-107,235,180);trait(-26,-102,-26,68);mot(-81,-76,'VISITES',19);mot(32,-76,'ACHATS',19);for(let j=0;j<=p;j++)mot(28,-48+j*21,['CAFÉ','PAIN','RIZ','CONFITURE'][j],14);rond(132,34,22,moyen);break;
    case 71: ellipse(-47,21,98,43,moyen);for(let j=0;j<4;j++)trait(-108+j*30,2,-91+j*30,-12,5);rect(88,-67,58,99,clair);ellipse(117,-68,29,9,fonce);mot(117,-10,'SEL',19);break;
    case 72: for(let i=0;i<2;i++){let x=-150+165*i;forme([[x,-8],[x+115,-66],[x+134,50],[x,50]],clair);for(let j=0;j<3;j++)rond(x+32+j*28,23-j*8,8,moyen);mot(x+59,84,i?'5 %':'95 %',22);}break;
    case 73: for(let j=0;j<3;j++){ellipse(-105+j*102,7,46,32,moyen);for(let k=0;k<4;k++)rond(-118+j*102+k*8,k%2*11,3,noir);}mot(0,76,p?'3 × 30 g':'30 g',30);break;
    case 74: for(let i=0;i<7;i++){rond(-86+(i%4)*26,-15+Math.floor(i/4)*25,18,fonce);}papier(33,-84,129,135);mot(97,-42,'100 ANS',22);break;
    case 75: bouteille(-92,-34);for(let j=0;j<2;j++){ellipse(30+j*76,40,39,16,j===p%2?moyen:clair);forme([[0+j*76,43],[10+j*76,74],[50+j*76,74],[61+j*76,43]],moyen);}break;
    case 76: forme([[-63,-95],[-17,-95],[0,-16],[-32,-5]],moyen);forme([[17,-95],[64,-95],[32,-5],[0,-16]],fonce);rond(0,26,58,clair);rond(0,26,48,moyen);mot(0,26,p>1?'MAISON':'Nº 1',22,86);break;
    case 77: for(let j=0;j<2;j++){let x=-77+j*155;ellipse(x,0,59,86,j?fonce:moyen);for(let k=-1;k<2;k++)trait(x-51,k*45,x+51,k*45,7);if(j)mot(x,18,'ÉCO',23);}break;
    case 78: forme([[-133,-23],[-33,-79],[88,-20],[88,50],[-133,50]],moyen);rect(42+u*14,-69,99,128);mot(92+u*14,-29,'EMBALLÉ',15);mot(92+u*14,3,'ICI',22);break;
    case 79: journal(-165,-87,'POUR LE PONT');journal(13,-87,'CONTRE LE PONT');break;
    case 80: journal(-120,-112,p<2?'INCROYABLE !':'CHIEN RETROUVÉ');ellipse(76,33,55,25,moyen);rond(122,10,25,moyen);ellipse(111,12,12,22,fonce);trait(23,30,0,12+nudge,7);break;
    case 81: rect(-130,-122,250,183,fonce);rect(-118,-110,226,159,clair);trait(-102,-10,94,-10,12);for(let x of [-80,63])trait(x,-12,x,37,9);rond(0,-56,11,fonce);trait(0,-43,3,-19);mot(-3,88,'LE TABLEAU',20);break;
    case 82: journal(-144,-95,p<2?'NOUVELLES':'SPONSORISÉ');rect(42,-8,113,65,clair);mot(98,25,'SAVON',23);break;
    case 83: rect(-137,-128,270,196,fonce);rect(-124,-115,244,170,clair);visage(-42,-30,14);visage(54,-29,18);mot(0,96,'UNE SECONDE',22);break;
    case 84: visage(-79,-5,30);trait(0,-125,0,88,2);visage(82,-5,8+u*17);break;
    case 85: rect(-151,-116,290,200);let h=p<2?55:145;rect(-90,52-h,61,h,moyen);rect(14,52-h-(p<2?49:3),61,h+(p<2?49:3),fonce);mot(-60,69,'100',17);mot(45,69,'101',17);break;
    case 86: for(let i=0;i<3;i++){let x=-116+100*i;rect(x-25,3,50,56,clair);forme([[x-38,3],[x,-30],[x+38,3]],fonce);trait(x+10,-25,x+10,-62);ellipse(x+14,-68,16,7,clair);trait(x+28,-68,x+49,-65,3);}break;
    case 87: for(let i=0;i<2;i++){let x=-140+i*151;rect(x,-46,125,105,moyen);trait(x+31,-33,x+95,-33,6);mot(x+63,12,i?'SOIF ?':'FONTAINE',17,110);}if(p>1)mot(0,89,'ET LA RÉPARATION ?',18);break;
    case 88: rond(0,-9,93,fonce);rond(0,-9,82,clair);for(let i=0;i<12;i++){let a=i*Math.PI/6;trait(65*Math.sin(a),-9-65*Math.cos(a),75*Math.sin(a),-9-75*Math.cos(a),4);}trait(0,-9,36,-38,7);trait(0,-9,59*Math.sin(t*.26),-9-59*Math.cos(t*.26),4);break;
    case 89: lampe(-79,0);lampe(74,0);rect(55,-34,34,30,moyen);mot(0,90,p>1?'ACCÈS À LA MÈCHE':'DEUX LANTERNES',19);break;
    case 90: c.beginPath();c.strokeStyle=fonce;c.lineWidth=16;c.arc(0,-33,53,Math.PI,2*Math.PI);c.stroke();rect(-70,-38,140,115,moyen);rond(0,8,13,noir);trait(0,17,0,41,8);break;
  }
  c.restore();
}
