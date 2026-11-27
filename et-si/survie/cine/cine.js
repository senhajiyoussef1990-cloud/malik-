/* ET SI ? — Saurais-tu survivre ?  Moteur « cinéma » (Canvas 2D, CPU).
   Couches : décor avec parallaxe et profondeur de champ, personnage peint (visage, mains à 5 doigts,
   plis des vêtements), particules (flammes, fumée, étincelles, vapeur), éclairage dynamique,
   étalonnage, grain, sous-titres. Chaque épisode fournit SHOTS(scène) -> plans. */
const W=1080,H=1920,TAU=Math.PI*2;
const PAL={noir:'#080B10',nuit:'#101C2C',anth:'#252B33',rouge:'#E53935',vert:'#22C55E',blanc:'#F5F5F5'};
const cv=document.getElementById('c');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');
let CUES={},CAPS=[],DRAFT=true;function setCues(c){CUES=c;}function CUE(k,d){return CUES[k]!=null?CUES[k]:d;}function setCaptions(c){CAPS=c;}function setDraft(b){DRAFT=b;}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,eout=t=>1-Math.pow(1-t,3),seg=(t,a,b)=>clamp((t-a)/(b-a));
const POOL={};function buf(n,w=W,h=H){let c=POOL[n];if(!c||c.width!==w||c.height!==h){c=document.createElement('canvas');c.width=w;c.height=h;POOL[n]=c;}const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.filter='none';x.clearRect(0,0,w,h);return c;}
function lg(c,x0,y0,x1,y1,s){const g=c.createLinearGradient(x0,y0,x1,y1);s.forEach(([o,k])=>g.addColorStop(o,k));return g;}
function rg(c,x,y,r0,r1,s,x1=x,y1=y){const g=c.createRadialGradient(x1,y1,r0,x,y,r1);s.forEach(([o,k])=>g.addColorStop(o,k));return g;}
function noiseTex(w,h,amp,seed){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),im=x.createImageData(w,h),r=mulberry(seed);for(let i=0;i<im.data.length;i+=4){const v=128+(r()-0.5)*amp;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}x.putImageData(im,0,0);return c;}
const GRAIN=noiseTex(512,512,80,9),FINE=noiseTex(256,256,40,4);
function texFill(c,tex,a,op,x,y,w,h,ox=0,oy=0){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.globalAlpha=a;c.globalCompositeOperation=op;for(let yy=y-oy;yy<y+h;yy+=tex.height)for(let xx=x-ox;xx<x+w;xx+=tex.width)c.drawImage(tex,xx,yy);c.restore();}
// bruit lisse 1D/2D (déterministe)
function hash(n){const s=Math.sin(n*127.1)*43758.5453;return s-Math.floor(s);}
function vnoise(x,y=0){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const h=(a,b)=>hash(a*57.3+b*131.7);return lerp(lerp(h(xi,yi),h(xi+1,yi),u),lerp(h(xi,yi+1),h(xi+1,yi+1),u),v);}

/* ================= PARTICULES ================= */
// flammes : flux continu de « bouffées » qui montent, refroidissent et deviennent fumée
function flames(c,x,y,w,h,t,int=1,seed=1){if(int<=0.01)return;const F=buf('fl'),f=F.getContext('2d');f.globalCompositeOperation='lighter';
  const N=Math.round(150*int),life=0.85;
  for(let i=0;i<N;i++){const r=mulberry(seed*1000+i);const b=r()*life;const age=((t+b)%life)/life;const cyc=Math.floor((t+b)/life);const r2=mulberry(seed*7777+i*31+cyc);
    const sx=(r2()-0.5)*w*0.85*(1-age*0.55);const turb=(vnoise(i*0.37,t*2.6+age*3)-0.5)*w*0.45*age;const yy=y-age*h*(0.5+r2()*0.75)*int;
    const xx=x+sx+turb;const sz=(w*0.085)*(0.6+r2()*0.8)*(1-age*0.6)*(0.7+0.3*int);
    const heat=1-age;const base=Math.abs(sx)/(w*0.45);const col=heat>0.82&&base<0.5?[255,236,180]:heat>0.55?[255,170,60]:heat>0.3?[250,100,25]:[180,45,12];const a=0.2*Math.pow(heat,0.9)*int;
    f.save();f.translate(xx,yy);f.scale(0.62,1.55);f.fillStyle=rg(f,0,0,0,sz,[[0,`rgba(${col[0]},${col[1]},${col[2]},${a})`],[1,`rgba(${col[0]},${col[1]},${col[2]},0)`]]);f.beginPath();f.arc(0,0,sz,0,TAU);f.fill();f.restore();}
  // cœur bleu à la base
  f.fillStyle=rg(f,x,y-6,0,w*0.4,[[0,`rgba(255,220,150,${0.3*int})`],[1,'rgba(255,140,40,0)']]);f.beginPath();f.ellipse(x,y-8,w*0.42,w*0.08,0,0,TAU);f.fill();
  c.save();c.globalCompositeOperation='lighter';c.filter='blur(26px)';c.globalAlpha=0.7;c.drawImage(F,0,0);c.filter='blur(3px)';c.globalAlpha=0.85;c.drawImage(F,0,0);c.filter='none';c.globalAlpha=0.5;c.drawImage(F,0,0);c.restore();
  // étincelles
  c.save();c.globalCompositeOperation='lighter';for(let i=0;i<Math.round(36*int);i++){const r=mulberry(seed*55+i);const life2=1.4+r()*0.8;const age=((t+r()*life2)%life2)/life2;const xx=x+(r()-0.5)*w*0.6+Math.sin(age*7+i)*30*age;const yy=y-age*h*1.6;
    c.strokeStyle=`rgba(255,${170+r()*70|0},90,${(1-age)*0.9})`;c.lineWidth=2.2;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+Math.sin(age*7+i)*4,yy+10);c.stroke();}c.restore();}
function smoke(c,x,y,w,h,t,a=0.5,seed=3,tone='38,38,44',N=26){c.save();c.filter='blur(26px)';for(let i=0;i<N;i++){const r=mulberry(seed*99+i);const life=3+r()*2;const age=((t+r()*life)%life)/life;
    const xx=x+(r()-0.5)*w*0.4+(vnoise(i,t*0.4)-0.5)*w*age*1.4;const yy=y-age*h;const sz=40+age*w*0.5;c.fillStyle=`rgba(${tone},${a*Math.sin(Math.PI*age)*(0.5+r()*0.5)})`;c.beginPath();c.arc(xx,yy,sz,0,TAU);c.fill();}c.restore();}
function wisps(c,x,y,w,t,a=0.35){ // fumée fine d'huile qui fume
  c.save();c.filter='blur(6px)';c.lineCap='round';for(let i=0;i<9;i++){const r=mulberry(400+i);const life=2.2+r()*1.2;const age=((t+r()*life)%life)/life;const x0=x+(r()-0.5)*w;
    c.strokeStyle=`rgba(200,200,205,${a*Math.sin(Math.PI*age)})`;c.lineWidth=10+age*18;c.beginPath();for(let k=0;k<=12;k++){const u=k/12;const yy=y-u*420*(0.4+age);const xx=x0+Math.sin(u*5+t*1.5+i)*30*u+(vnoise(i+u*3,t)-0.5)*60*u;k?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}c.restore();}

/* ================= LUMIÈRE / CAMÉRA / ÉTALONNAGE ================= */
function relight(c,lights,amb){const cw=c.canvas.width,ch=c.canvas.height;const L=buf('lm'+cw,cw,ch),l=L.getContext('2d');l.fillStyle=amb;l.fillRect(0,0,cw,ch);l.globalCompositeOperation='lighter';
  for(const o of lights){l.fillStyle=rg(l,o.x,o.y,0,o.r,[[0,o.c],[0.35,o.c2||o.c],[1,'rgba(0,0,0,0)']]);l.fillRect(0,0,cw,ch);}
  c.save();c.globalCompositeOperation='multiply';c.drawImage(L,0,0);c.restore();}
function fireLight(x,y,k,t){const fl=0.85+0.15*Math.sin(t*17)*Math.sin(t*6.3+1);return {x,y,r:1300*k,c:`rgba(255,${150|0},70,${k*fl})`,c2:`rgba(220,90,30,${0.6*k*fl})`};}
function lampLight(x,y,k){return {x,y,r:1200*k,c:`rgba(255,226,185,${k})`,c2:`rgba(200,170,130,${0.55*k})`};}
function grade(c,t,o={}){ // étalonnage cinéma : vignette, contraste doux, ombres bleutées, grain
  c.save();c.globalCompositeOperation='soft-light';c.fillStyle=lg(c,0,0,0,H,[[0,'rgba(16,28,44,0.55)'],[1,'rgba(8,11,16,0.5)']]);c.fillRect(0,0,W,H);c.restore();
  c.fillStyle=rg(c,W/2,H*0.45,H*0.22,H*0.78,[[0,'rgba(0,0,0,0)'],[1,`rgba(0,0,0,${o.vig??0.62})`]]);c.fillRect(0,0,W,H);
  texFill(c,GRAIN,0.06,'overlay',0,0,W,H,(t*997%512)|0,(t*613%512)|0);
  // bandes « scope » très légères en haut et en bas
  c.fillStyle='rgba(0,0,0,0.35)';c.fillRect(0,0,W,40);c.fillRect(0,H-40,W,40);}
function camXf(c,cam){if(!cam)return;c.translate(W/2,H/2);c.scale(cam.z||1,cam.z||1);c.rotate(cam.r||0);c.translate(-(cam.x??W/2),-(cam.y??H/2));}
function camAt(t,d,a,b,f=ease){const k=f(clamp(t/d));const o={};for(const key of Object.keys(b))o[key]=lerp(a[key]??b[key],b[key],k);return o;}
function shake(t,amp,f=23){return {x:(vnoise(t*f,1)-0.5)*amp*2,y:(vnoise(t*f,7)-0.5)*amp*2};}

/* ================= PERSONNAGE PEINT (3/4 vers la droite) ================= */
const MAN={skin:[201,150,118],skinD:[128,84,62],hair:'#1b1512',beard:'rgba(40,28,22,0.55)',shirt:[72,86,104],shirtD:[38,46,58],apron:null,eye:'#4a3020'};
const rgb=(a,k=1,al=1)=>`rgba(${a[0]*k|0},${a[1]*k|0},${a[2]*k|0},${al})`;
function bez(c,p){const n=p.length;const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];let s=m(p[n-1],p[0]);c.moveTo(s[0],s[1]);for(let i=0;i<n;i++){const q=m(p[i],p[(i+1)%n]);c.quadraticCurveTo(p[i][0],p[i][1],q[0],q[1]);}}
// tête : centre (x,y), hauteur hh. ex = {eye:0..1 ouverture, brow:-1..1, mouth:0..1, look:-1..1, lightX: côté de la lumière (+1 droite)}
function head(c,x,y,hh,ex={},col=MAN){const s=hh;const eye=ex.eye??0.55,brow=ex.brow??0,mouth=ex.mouth??0,lx=ex.lightX??1;
  c.save();c.translate(x,y);c.rotate(ex.tilt||0);c.scale(s,s);
  // cou
  c.fillStyle=lg(c,-0.2,0,0.25,0,[[0,rgb(col.skinD,0.85)],[1,rgb(col.skin,0.9)]]);c.beginPath();c.moveTo(-0.16,0.3);c.lineTo(0.17,0.36);c.lineTo(0.2,0.78);c.lineTo(-0.2,0.8);c.closePath();c.fill();
  c.fillStyle='rgba(30,15,10,0.35)';c.beginPath();c.moveTo(-0.16,0.34);c.quadraticCurveTo(0.05,0.52,0.19,0.44);c.lineTo(0.18,0.56);c.quadraticCurveTo(0,0.6,-0.17,0.5);c.fill();
  // crâne + visage (contour 3/4)
  const face=[[-0.36,-0.12],[-0.38,-0.40],[-0.02,-0.56],[0.2,-0.5],[0.36,-0.42],[0.42,-0.22],[0.41,-0.08],[0.41,-0.03],[0.40,0.0],[0.44,0.08],[0.48,0.12],[0.45,0.15],[0.42,0.18],[0.40,0.18],[0.41,0.22],[0.42,0.25],[0.40,0.28],[0.41,0.31],[0.40,0.36],[0.38,0.42],[0.35,0.48],[0.24,0.52],[0.14,0.5],[0.0,0.44],[-0.1,0.36],[-0.2,0.24],[-0.26,0.14],[-0.3,0.04],[-0.36,-0.12]];
  c.fillStyle=rg(c,0.18*lx,-0.1,0.05,0.75,[[0,rgb(col.skin,1.06)],[0.55,rgb(col.skin,0.92)],[1,rgb(col.skinD,0.8)]]);c.beginPath();bez(c,face);c.closePath();c.fill();
  c.save();c.beginPath();bez(c,face);c.closePath();c.clip();
  // modelé : ombre côté opposé à la lumière, joue, orbite, sillon
  c.fillStyle=lg(c,-0.4,0,0.5,0,lx>0?[[0,'rgba(40,20,12,0.55)'],[0.45,'rgba(40,20,12,0.08)'],[1,'rgba(255,220,190,0.12)']]:[[0,'rgba(255,220,190,0.1)'],[0.6,'rgba(40,20,12,0.1)'],[1,'rgba(40,20,12,0.55)']]);c.fillRect(-0.5,-0.6,1.1,1.2);
  c.fillStyle='rgba(60,25,15,0.25)';c.beginPath();c.ellipse(0.25,-0.04,0.12,0.07,0,0,TAU);c.fill(); // orbite
  c.fillStyle='rgba(190,90,70,0.16)';c.beginPath();c.ellipse(0.24,0.16,0.11,0.08,0,0,TAU);c.fill(); // joue
  c.strokeStyle='rgba(70,30,20,0.35)';c.lineWidth=0.012;c.beginPath();c.moveTo(0.37,0.17);c.quadraticCurveTo(0.31,0.24,0.33,0.3);c.stroke(); // sillon
  // barbe courte (densité de points)
  const rb=mulberry(77);c.fillStyle=col.beard;c.beginPath();c.moveTo(-0.08,0.12);c.quadraticCurveTo(0.0,0.3,0.14,0.38);c.lineTo(0.3,0.33);c.lineTo(0.41,0.24);c.lineTo(0.44,0.31);c.lineTo(0.38,0.5);c.lineTo(0.2,0.56);c.lineTo(-0.05,0.45);c.lineTo(-0.22,0.24);c.closePath();c.fill();
  c.strokeStyle='rgba(25,15,10,0.35)';c.lineWidth=0.004;for(let i=0;i<260;i++){const px=-0.18+rb()*0.6,py=0.16+rb()*0.36;c.beginPath();c.moveTo(px,py);c.lineTo(px+0.006,py+0.014);c.stroke();}
  c.fillStyle='rgba(30,18,12,0.5)';c.beginPath();c.ellipse(0.4,0.2,0.05,0.018,-0.2,0,TAU);c.fill(); // moustache
  c.restore();
  // oreille
  c.fillStyle=rgb(col.skin,0.9);c.beginPath();c.ellipse(-0.1,0.02,0.07,0.12,0.15,0,TAU);c.fill();c.strokeStyle='rgba(80,35,25,0.6)';c.lineWidth=0.014;c.beginPath();c.ellipse(-0.1,0.02,0.04,0.08,0.15,-1.2,1.9);c.stroke();
  // cheveux
  c.fillStyle=col.hair;c.beginPath();c.moveTo(0.3,-0.36);c.bezierCurveTo(0.22,-0.58,-0.25,-0.62,-0.38,-0.36);c.bezierCurveTo(-0.44,-0.2,-0.4,-0.02,-0.3,0.08);c.lineTo(-0.2,0.06);c.bezierCurveTo(-0.22,-0.05,-0.16,-0.12,-0.04,-0.12);c.lineTo(0.0,0.04);c.lineTo(0.04,-0.2);c.bezierCurveTo(0.12,-0.3,0.24,-0.3,0.3,-0.36);c.fill();
  c.strokeStyle='rgba(120,90,70,0.25)';c.lineWidth=0.006;const rh=mulberry(9);for(let i=0;i<60;i++){const a=-2.8+rh()*1.9,r0=0.36+rh()*0.12;c.beginPath();c.moveTo(Math.cos(a)*r0*0.9,-0.18+Math.sin(a)*r0);c.lineTo(Math.cos(a+0.12)*r0,-0.18+Math.sin(a+0.12)*r0*1.02);c.stroke();}
  if(lx>0){c.strokeStyle='rgba(255,170,100,0.35)';c.lineWidth=0.02;c.beginPath();c.moveTo(0.28,-0.38);c.bezierCurveTo(0.2,-0.54,-0.1,-0.6,-0.25,-0.52);c.stroke();}
  // œil (3/4) + paupières + sourcil
  const ex0=0.27,ey0=-0.03,ew=0.085,eh=0.03+0.035*eye;
  c.save();c.beginPath();c.moveTo(ex0-ew,ey0);c.quadraticCurveTo(ex0,ey0-eh*1.4,ex0+ew*0.8,ey0+0.005);c.quadraticCurveTo(ex0,ey0+eh*0.9,ex0-ew,ey0);c.closePath();c.fillStyle='#e9e2da';c.fill();c.clip();
  const lk=(ex.look??0.5)*0.03;c.fillStyle=col.eye;c.beginPath();c.arc(ex0+lk+0.02,ey0,0.033,0,TAU);c.fill();c.fillStyle='#0b0705';c.beginPath();c.arc(ex0+lk+0.02,ey0,0.015,0,TAU);c.fill();
  c.fillStyle='rgba(255,240,220,0.95)';c.beginPath();c.arc(ex0+lk+0.03,ey0-0.012,0.007,0,TAU);c.fill();c.fillStyle='rgba(0,0,0,0.25)';c.fillRect(ex0-ew,ey0-eh*1.5,ew*2,eh*0.5);c.restore();
  c.strokeStyle='#1a0f0a';c.lineWidth=0.014;c.beginPath();c.moveTo(ex0-ew,ey0);c.quadraticCurveTo(ex0,ey0-eh*1.4,ex0+ew*0.8,ey0+0.005);c.stroke();
  c.strokeStyle='rgba(90,45,30,0.5)';c.lineWidth=0.008;c.beginPath();c.moveTo(ex0-ew*0.8,ey0-eh*1.5-0.02);c.quadraticCurveTo(ex0,ey0-eh*2.2-0.02,ex0+ew*0.7,ey0-eh*1.2-0.02);c.stroke(); // pli
  c.beginPath();c.moveTo(ex0-ew*0.8,ey0+0.02);c.quadraticCurveTo(ex0,ey0+eh+0.01,ex0+ew*0.6,ey0+0.02);c.stroke();
  // œil lointain (aperçu)
  c.fillStyle='rgba(30,15,10,0.8)';c.beginPath();c.ellipse(0.42,-0.02,0.012,0.008+0.008*eye,0,0,TAU);c.fill();
  const by=-0.13-0.04*brow;c.strokeStyle=col.hair;c.lineCap='round';c.lineWidth=0.035;c.beginPath();c.moveTo(0.17,by+0.02);c.quadraticCurveTo(0.28,by-0.03-0.02*brow,0.39,by+0.01);c.stroke();
  // nez : arête + narine
  c.strokeStyle='rgba(255,225,200,0.35)';c.lineWidth=0.012;c.beginPath();c.moveTo(0.40,-0.02);c.lineTo(0.45,0.09);c.stroke();
  c.fillStyle='rgba(60,25,15,0.55)';c.beginPath();c.ellipse(0.4,0.135,0.022,0.012,0.3,0,TAU);c.fill();
  // bouche
  const mo=mouth*0.04;c.fillStyle='rgba(120,60,50,0.9)';c.beginPath();c.moveTo(0.34,0.25);c.quadraticCurveTo(0.39,0.235,0.43,0.245);c.quadraticCurveTo(0.39,0.27+mo,0.34,0.25);c.fill();
  if(mouth>0.05){c.fillStyle='#1a0a08';c.beginPath();c.ellipse(0.395,0.255+mo*0.5,0.03,mo*0.6+0.004,0,0,TAU);c.fill();}
  c.strokeStyle='rgba(50,20,15,0.8)';c.lineWidth=0.01;c.beginPath();c.moveTo(0.34,0.25);c.quadraticCurveTo(0.39,0.255+mo*0.5,0.435,0.248);c.stroke();
  c.restore();}
// main : (x,y) poignet, angle, taille, type 'grip' (tient un manche) | 'open' (paume ouverte) | 'rest'
function hand(c,x,y,ang,sz,type='rest',col=MAN,lx=1){c.save();c.translate(x,y);c.rotate(ang);c.scale(sz,sz);
  const sk=lg(c,0,-0.5,0,0.5,lx>0?[[0,rgb(col.skin,1.05)],[1,rgb(col.skinD,0.85)]]:[[0,rgb(col.skinD,0.85)],[1,rgb(col.skin,1.0)]]);
  const finger=(bx,by,a,len,w,curl=0)=>{c.save();c.translate(bx,by);c.rotate(a);const seg=[len*0.45,len*0.32,len*0.26];let px=0,py=0,ca=0;c.fillStyle=sk;
    for(let i=0;i<3;i++){const nx=px+Math.cos(ca)*seg[i],ny=py+Math.sin(ca)*seg[i];c.lineCap='round';c.strokeStyle=sk;c.lineWidth=w*(1-i*0.12);c.beginPath();c.moveTo(px,py);c.lineTo(nx,ny);c.stroke();
      c.strokeStyle='rgba(90,40,30,0.35)';c.lineWidth=0.012;if(i<2){c.beginPath();c.arc(nx,ny,w*0.3,ca-1,ca+1);c.stroke();}px=nx;py=ny;ca+=curl;}
    c.fillStyle='rgba(255,230,215,0.55)';c.beginPath();c.ellipse(px-Math.cos(ca)*0.02,py-Math.sin(ca)*0.02,w*0.28,w*0.2,ca,0,TAU);c.fill();c.restore();};
  // paume
  c.fillStyle=sk;c.beginPath();c.moveTo(0,-0.2);c.bezierCurveTo(0.25,-0.26,0.5,-0.22,0.55,-0.12);c.lineTo(0.56,0.16);c.bezierCurveTo(0.48,0.24,0.2,0.26,0,0.2);c.closePath();c.fill();
  c.strokeStyle='rgba(90,40,30,0.3)';c.lineWidth=0.012;c.beginPath();c.moveTo(0.12,-0.05);c.quadraticCurveTo(0.3,0.05,0.48,0.02);c.stroke();
  if(type==='grip'){ // doigts enroulés autour d'un manche horizontal
    for(let i=0;i<4;i++)finger(0.5,-0.15+i*0.1,0.35,0.36-Math.abs(i-1.2)*0.03,0.105,1.05);finger(0.2,-0.2,-0.55,0.34,0.13,0.3);}
  else if(type==='open'){for(let i=0;i<4;i++)finger(0.55,-0.16+i*0.105,(i-1.5)*0.12,0.44-Math.abs(i-1.2)*0.05,0.105,0.1);finger(0.16,-0.2,-0.95,0.36,0.13,0.18);}
  else {for(let i=0;i<4;i++)finger(0.54,-0.15+i*0.1,0.45+(i*0.05),0.4-Math.abs(i-1.2)*0.04,0.105,0.35);finger(0.2,-0.2,-0.6,0.34,0.13,0.3);}
  c.restore();}
// bras (épaule -> coude -> poignet) avec manche courte
function limb(c,ax,ay,bx,by,w1,w2,fill){const a=Math.atan2(by-ay,bx-ax),nx=-Math.sin(a),ny=Math.cos(a);c.fillStyle=fill;c.beginPath();c.moveTo(ax+nx*w1/2,ay+ny*w1/2);c.lineTo(bx+nx*w2/2,by+ny*w2/2);c.arc(bx,by,w2/2,a+Math.PI/2,a-Math.PI/2,true);c.lineTo(ax-nx*w1/2,ay-ny*w1/2);c.arc(ax,ay,w1/2,a-Math.PI/2,a+Math.PI/2,true);c.fill();}
function cylFill(c,ax,ay,bx,by,w,light,dark){const a=Math.atan2(by-ay,bx-ax),nx=-Math.sin(a)*w/2,ny=Math.cos(a)*w/2;const mx=(ax+bx)/2,my=(ay+by)/2;return lg(c,mx-nx,my-ny,mx+nx,my+ny,[[0,dark],[0.55,light],[1,dark]]);}
// buste : x,y = base du cou ; u = taille d'une tête ; pose : {lean, armN:[sx,sy (rel), ex,ey, wx,wy] , handN, armF..., ex}
function bust(c,x,y,u,p,col=MAN){const lx=p.lightX??1;c.save();c.translate(x,y);c.rotate(p.lean||0);
  const arm=(A,front,ht,ha)=>{const [sx,sy,ex_,ey,wx,wy]=A.map(v=>v*u);const k=front?1:0.72;
    // haut du bras (manche)
    limb(c,sx,sy,ex_,ey,0.6*u,0.5*u,cylFill(c,sx,sy,ex_,ey,0.5*u,rgb(col.skin,0.95*k),rgb(col.skinD,0.8*k)));
    const mx=lerp(sx,ex_,0.4),my=lerp(sy,ey,0.4);limb(c,sx,sy,mx,my,0.72*u,0.66*u,cylFill(c,sx,sy,mx,my,0.72*u,rgb(col.shirt,1.05*k),rgb(col.shirtD,0.9*k)));
    limb(c,ex_,ey,wx,wy,0.48*u,0.36*u,cylFill(c,ex_,ey,wx,wy,0.48*u,rgb(col.skin,1.0*k),rgb(col.skinD,0.85*k)));
    hand(c,wx,wy,(front&&p.handNabs!=null)?p.handNabs-(p.lean||0):Math.atan2(wy-ey,wx-ex_)+(ha||0),0.78*u,ht,col,lx);};
  if(p.armF)arm(p.armF,false,p.handF,p.handFa);
  // torse (t-shirt) : épaules tombantes, poitrine, taille ; plis doux
  c.fillStyle=lg(c,-u,0,u,0,lx>0?[[0,rgb(col.shirtD,0.85)],[0.55,rgb(col.shirt,1.0)],[1,rgb(col.shirt,1.12)]]:[[0,rgb(col.shirt,1.1)],[0.5,rgb(col.shirt,0.95)],[1,rgb(col.shirtD,0.85)]]);
  c.beginPath();c.moveTo(-0.22*u,0.02*u);c.bezierCurveTo(-0.5*u,0.08*u,-0.78*u,0.18*u,-0.86*u,0.42*u);c.bezierCurveTo(-0.92*u,0.9*u,-0.8*u,1.6*u,-0.72*u,2.4*u);c.lineTo(-0.74*u,3.3*u);c.lineTo(0.78*u,3.3*u);c.lineTo(0.76*u,2.5*u);
  c.bezierCurveTo(0.9*u,1.9*u,1.0*u,1.2*u,0.96*u,0.62*u);c.bezierCurveTo(0.94*u,0.32*u,0.74*u,0.12*u,0.3*u,0.04*u);c.quadraticCurveTo(0.05*u,0.12*u,-0.22*u,0.02*u);c.fill();
  c.save();c.filter=`blur(${0.05*u}px)`;c.strokeStyle='rgba(15,18,26,0.35)';c.lineWidth=0.12*u;c.lineCap='round';
  for(const f of [[[-0.45,0.6],[-0.25,1.1],[-0.4,1.7]],[[0.45,0.7],[0.3,1.2],[0.55,1.7]],[[-0.4,2.1],[0.0,2.3],[0.4,2.15]]]){c.beginPath();c.moveTo(f[0][0]*u,f[0][1]*u);c.quadraticCurveTo(f[1][0]*u,f[1][1]*u,f[2][0]*u,f[2][1]*u);c.stroke();}
  c.strokeStyle='rgba(255,255,255,0.08)';c.lineWidth=0.1*u;c.beginPath();c.moveTo(0.6*u,0.6*u);c.quadraticCurveTo(0.72*u,1.3*u,0.6*u,2.1*u);c.stroke();c.restore();
  c.fillStyle=rgb(col.shirtD,0.75);c.beginPath();c.moveTo(-0.24*u,0.02*u);c.quadraticCurveTo(0.05*u,0.2*u,0.32*u,0.04*u);c.quadraticCurveTo(0.05*u,0.1*u,-0.24*u,0.02*u);c.fill();
  c.restore();
  head(c,x+0.08*u+(p.headDX||0)*u,y-0.5*u+(p.headDY||0)*u,1.25*u,{...(p.ex||{}),lightX:lx},col);
  if(p.held)p.held(c);c.save();c.translate(x,y);c.rotate(p.lean||0);if(p.armN)arm(p.armN,true,p.handN,p.handNa);c.restore();}
// prise d'objet : renvoie le poignet (en unités du buste) pour que les doigts serrent le point G (monde),
// la main étant orientée selon l'angle a du manche. À utiliser avec handN:'grip' et handNabs:a.
function gripWrist(nb,u,lean,G,a){const sz=0.78*u;const wx=G[0]-Math.cos(a)*0.62*sz-(-Math.sin(a))*0.0,wy=G[1]-Math.sin(a)*0.62*sz;const dx=(wx-nb[0])/u,dy=(wy-nb[1])/u;const cs=Math.cos(-lean),sn=Math.sin(-lean);return [dx*cs-dy*sn,dx*sn+dy*cs];}
function elbowFor(sh,wr,bend=1){const mx=(sh[0]+wr[0])/2,my=(sh[1]+wr[1])/2;const dx=wr[0]-sh[0],dy=wr[1]-sh[1];const L=Math.hypot(dx,dy),need=Math.max(0,(2.6*2.6/4-L*L/4));const h=Math.sqrt(need)*0.5;return [mx-dy/L*h*bend,my+dx/L*h*bend];}

/* passe de modelé peint : dessine un personnage via fn(ctx) dans un calque, ajoute ombres douces
   (côté opposé à la lumière), lumière de contour, et adoucit le trait. light = {dx,dy (direction vers la lumière), col, k, scale} */
function painted(c,fn,light){const cw=c.canvas.width,ch=c.canvas.height;const F=buf('pf'+cw,cw,ch),f=F.getContext('2d');fn(f);const sc=light.scale||100;
  const M=buf('pm'+cw,cw,ch),m=M.getContext('2d');m.drawImage(F,0,0);m.globalCompositeOperation='source-in';m.fillStyle='#000';m.fillRect(0,0,cw,ch);
  // ombre propre : silhouette moins la silhouette décalée vers la lumière, floutée
  const S=buf('ps'+cw,cw,ch),s2=S.getContext('2d');s2.drawImage(M,0,0);s2.globalCompositeOperation='destination-out';s2.filter=`blur(${sc*0.12}px)`;s2.drawImage(M,light.dx*sc*0.35,light.dy*sc*0.35);
  s2.filter='none';f.save();f.globalCompositeOperation='source-atop';f.globalAlpha=light.shadow??0.6;f.filter=`blur(${sc*0.08}px)`;f.drawImage(S,0,0);f.restore();
  // occlusion de bord
  const O=buf('po'+cw,cw,ch),o=O.getContext('2d');o.fillStyle='#000';o.fillRect(0,0,cw,ch);o.globalCompositeOperation='destination-out';o.filter=`blur(${sc*0.05}px)`;o.drawImage(M,0,0);
  f.save();f.globalCompositeOperation='source-atop';f.globalAlpha=0.5;f.drawImage(O,0,0);f.restore();
  // lumière de contour
  const R=buf('pr'+cw,cw,ch),r=R.getContext('2d');r.drawImage(M,0,0);r.globalCompositeOperation='destination-out';r.drawImage(M,-light.dx*sc*0.06,-light.dy*sc*0.06);r.globalCompositeOperation='source-in';r.fillStyle=light.col||'rgba(255,160,80,1)';r.fillRect(0,0,cw,ch);
  f.save();f.globalCompositeOperation='source-atop';f.globalAlpha=light.k??0.8;f.filter=`blur(${sc*0.025}px)`;f.drawImage(R,0,0);f.filter='none';f.globalAlpha=(light.k??0.8)*0.6;f.drawImage(R,0,0);f.restore();
  c.save();c.filter=`blur(${light.soft??0.8}px)`;c.drawImage(F,0,0);c.restore();}

/* ================= CUISINE DÉTAILLÉE (vue de face, couches) ================= */
function tiles(c,x0,y0,x1,y1,tw,th,seed,base=[226,222,214]){c.fillStyle='#9c978f';c.fillRect(x0,y0,x1-x0,y1-y0);const r=mulberry(seed);
  for(let y=y0,row=0;y<y1;y+=th,row++)for(let x=x0-(row%2?tw/2:0);x<x1;x+=tw){const v=(r()-0.5)*14;c.fillStyle=`rgb(${base[0]+v|0},${base[1]+v|0},${base[2]+v|0})`;c.fillRect(x+2,y+2,tw-4,th-4);c.fillStyle='rgba(255,255,255,0.28)';c.fillRect(x+4,y+4,tw-8,4);c.fillStyle='rgba(0,0,0,0.08)';c.fillRect(x+2,y+th-6,tw-4,4);}}
function wood(c,x,y,w,h,seed,base=[118,84,56]){c.fillStyle=lg(c,x,0,x+w,0,[[0,rgb(base,0.85)],[0.5,rgb(base,1.0)],[1,rgb(base,0.8)]]);c.fillRect(x,y,w,h);const r=mulberry(seed);c.strokeStyle='rgba(40,22,10,0.22)';c.lineWidth=2;
  for(let i=0;i<w/6;i++){const xx=x+r()*w;c.beginPath();c.moveTo(xx,y);c.bezierCurveTo(xx+8*(r()-0.5),y+h*0.3,xx-8*(r()-0.5),y+h*0.7,xx+4,y+h);c.stroke();}}
function cabinetDoor(c,x,y,w,h,seed){wood(c,x,y,w,h,seed);c.strokeStyle='rgba(0,0,0,0.35)';c.lineWidth=5;c.strokeRect(x+16,y+16,w-32,h-32);c.fillStyle=lg(c,0,y,0,y+h,[[0,'#e4e4e4'],[1,'#7d7d7d']]);c.fillRect(x+w-36,y+h*0.4,9,h*0.2);}
function jar(c,x,y,w,h,fill){c.fillStyle='rgba(220,235,245,0.25)';c.beginPath();c.roundRect(x,y,w,h,10);c.fill();c.fillStyle=fill;c.fillRect(x+4,y+h*0.35,w-8,h*0.62);c.fillStyle='rgba(255,255,255,0.35)';c.fillRect(x+6,y+6,5,h-12);c.fillStyle='#7b6a58';c.fillRect(x-2,y-10,w+4,14);}
function kitchenBack(c){ // plan arrière (mur, fenêtre, étagères, hotte) — y de plan de travail = 1220
  c.fillStyle=lg(c,0,0,0,1220,[[0,'#3a3833'],[1,'#57534b']]);c.fillRect(0,0,W*1.6,H);
  // fenêtre de nuit à gauche avec reflets de ville
  c.fillStyle='#0a1422';c.fillRect(40,540,330,440);c.fillStyle=lg(c,0,540,0,980,[[0,'#13233b'],[1,'#0a1322']]);c.fillRect(54,554,302,412);const rs=mulberry(3);
  for(let i=0;i<60;i++){c.fillStyle=`rgba(255,${200+rs()*40|0},140,${rs()*0.7})`;c.fillRect(60+rs()*290,780+rs()*180,3+rs()*4,4+rs()*6);}
  c.fillStyle='#d4cdbf';c.fillRect(200,554,10,412);c.fillRect(54,756,302,10);c.fillStyle='#cdc6b8';c.fillRect(28,975,354,26);
  // crédence carrelée
  tiles(c,400,760,W*1.6,1220,92,46,8);
  // étagère + bocaux
  c.fillStyle='#5c4330';c.fillRect(420,600,420,20);jar(c,440,500,60,100,'rgba(210,170,90,0.85)');jar(c,520,520,56,80,'rgba(160,60,40,0.8)');jar(c,600,490,62,110,'rgba(230,220,200,0.85)');jar(c,690,515,52,85,'rgba(90,120,60,0.8)');
  // ustensiles suspendus
  c.strokeStyle='#888';c.lineWidth=4;c.beginPath();c.moveTo(1180,700);c.lineTo(1500,700);c.stroke();for(let i=0;i<4;i++){const x=1210+i*70;c.strokeStyle='#2a2a2a';c.lineWidth=8;c.beginPath();c.moveTo(x,700);c.lineTo(x,840);c.stroke();c.fillStyle='#6d6f73';c.beginPath();c.ellipse(x,860,i%2?18:26,i%2?30:22,0,0,TAU);c.fill();}
  // meubles hauts
  cabinetDoor(c,860,240,260,420,11);cabinetDoor(c,1120,240,260,420,12);cabinetDoor(c,0,220,380,300,13);
  // hotte inox
  c.fillStyle=lg(c,560,0,900,0,[[0,'#7f8388'],[0.4,'#d9dcdf'],[0.6,'#a7abaf'],[1,'#6f7378']]);c.fillRect(660,200,150,420);c.beginPath();c.moveTo(540,620);c.lineTo(930,620);c.lineTo(980,740);c.lineTo(490,740);c.closePath();c.fill();
  c.fillStyle='#1c1e21';c.fillRect(490,740,490,14);c.fillStyle='rgba(255,236,200,0.9)';c.fillRect(600,752,80,6);c.fillRect(790,752,80,6);}
function counter(c){ // plan de travail + four + plaques + meubles bas
  c.fillStyle=lg(c,0,1196,0,1262,[[0,'#d8d2c6'],[0.4,'#bdb6a8'],[1,'#7f796e']]);c.fillRect(0,1196,W*1.6,66);texFill(c,FINE,0.3,'overlay',0,1196,W*1.6,66);c.fillStyle='rgba(255,255,255,0.5)';c.fillRect(0,1196,W*1.6,3);
  for(let x=0;x<W*1.6;x+=300){c.fillStyle=lg(c,x,0,x+300,0,[[0,'#323a44'],[0.5,'#3e4752'],[1,'#2e353e']]);c.fillRect(x+4,1262,292,560);c.strokeStyle='rgba(0,0,0,0.45)';c.lineWidth=4;c.strokeRect(x+20,1282,260,520);c.fillStyle=lg(c,0,0,0,12,[[0,'#ececec'],[1,'#8a8a8a']]);c.fillRect(x+105,1310,90,11);}
  c.fillStyle=lg(c,0,1262,0,1370,[[0,'#cfd2d6'],[1,'#8c9096']]);c.fillRect(520,1262,460,104);c.fillStyle='#101214';c.fillRect(540,1380,420,330);c.fillStyle=lg(c,540,1380,960,1710,[[0,'rgba(255,255,255,0.14)'],[0.35,'rgba(255,255,255,0)']]);c.fillRect(540,1380,420,330);
  c.fillStyle='#0b0c0e';c.fillRect(500,1180,500,18);for(const gx of [560,790]){c.strokeStyle='#26282c';c.lineWidth=9;c.strokeRect(gx,1158,170,26);}
  c.fillStyle='#1a1511';c.fillRect(0,1822,W*1.6,H);}
function knob(c,x,y,r,ang){c.save();c.shadowColor='rgba(0,0,0,0.6)';c.shadowBlur=10;c.shadowOffsetY=4;c.fillStyle=rg(c,x,y,1,r*1.2,[[0,'#f0f0f0'],[0.6,'#9a9ea3'],[1,'#4b4e52']],x-r*0.3,y-r*0.3);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();c.strokeStyle='#1a1a1a';c.lineWidth=r*0.2;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(ang)*r*0.75,y-Math.cos(ang)*r*0.75);c.stroke();}
function knobs(c){for(let i=0;i<4;i++)knob(c,580+i*110,1314,28,-0.9);}
// poêle (manche à gauche) + huile ; o.shimmer, o.spatula = position du spatule 0..1
function fryPan(c,x,y,t,o={}){c.save();c.translate(x,y);
  c.fillStyle=lg(c,0,-60,0,6,[[0,'#3d4046'],[1,'#111215']]);c.beginPath();c.moveTo(-150,-56);c.lineTo(150,-56);c.lineTo(128,4);c.lineTo(-128,4);c.closePath();c.fill();
  c.fillStyle=lg(c,-150,0,150,0,[[0,'#4c5056'],[0.5,'#a4a8ae'],[1,'#44484e']]);c.fillRect(-154,-62,308,10);
  c.fillStyle=lg(c,0,-58,0,-36,[[0,'#2b2d31'],[1,'#0e0f11']]);c.beginPath();c.roundRect(-400,-56,250,24,12);c.fill();c.fillStyle='#5a3a24';c.beginPath();c.roundRect(-400,-58,140,28,14);c.fill();
  // huile (vue légèrement de dessus)
  c.fillStyle=lg(c,0,-66,0,-50,[[0,'rgba(230,170,60,0.95)'],[1,'rgba(160,100,20,0.95)']]);c.beginPath();c.ellipse(0,-60,146,10,0,0,TAU);c.fill();
  if(o.shimmer){c.globalCompositeOperation='lighter';for(let i=0;i<10;i++){const xx=-130+((i*53+t*120)%260);c.fillStyle=`rgba(255,240,200,${0.25*o.shimmer*(0.5+0.5*Math.sin(t*9+i))})`;c.beginPath();c.ellipse(xx,-61,14,2.5,0,0,TAU);c.fill();}
    for(let i=0;i<14;i++){const r=mulberry(i+3);const ph=(t*1.8+r())%1;c.fillStyle=`rgba(255,250,230,${0.5*o.shimmer*(1-ph)})`;c.beginPath();c.arc(-120+r()*240,-62,1.5+ph*4,0,TAU);c.fill();}c.globalCompositeOperation='source-over';}
  // légumes
  if(o.food){const r=mulberry(5);for(let i=0;i<16;i++){const fx=-110+r()*220+Math.sin(t*2+i)*4*(o.stir||0);c.fillStyle=i%3?'#7a9a3a':'#c86a2a';c.beginPath();c.ellipse(fx,-64+r()*4,10+r()*8,5,r()*3,0,TAU);c.fill();}}
  c.restore();}
function spatula(c,x,y,ang){c.save();c.translate(x,y);c.rotate(ang);c.fillStyle=lg(c,-8,0,8,0,[[0,'#2a1c12'],[0.5,'#5a402a'],[1,'#2a1c12']]);c.beginPath();c.roundRect(-8,-330,16,290,8);c.fill();c.fillStyle='#1f1f22';c.beginPath();c.roundRect(-34,-44,68,54,8);c.fill();c.restore();}
function glassOfWater(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='rgba(190,215,235,0.22)';c.strokeStyle='rgba(235,245,255,0.75)';c.lineWidth=4;c.beginPath();c.moveTo(-40,-170);c.lineTo(40,-170);c.lineTo(32,0);c.lineTo(-32,0);c.closePath();c.fill();c.stroke();
  c.fillStyle=lg(c,0,-110,0,0,[[0,'rgba(120,180,230,0.55)'],[1,'rgba(80,140,200,0.75)']]);c.beginPath();c.moveTo(-37,-110);c.lineTo(37,-110);c.lineTo(32,-4);c.lineTo(-32,-4);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,0.45)';c.fillRect(-28,-160,6,150);c.restore();}

/* ================= HABILLAGE ================= */
function marks(c){c.save();c.font='600 26px M';c.fillStyle='rgba(245,245,245,0.62)';c.textAlign='left';c.textBaseline='alphabetic';c.fillText('© ET SI ? — Saurais-tu survivre ?',60,210);
  c.textAlign='right';c.fillText('SIMULATION',W-60,210);if(DRAFT){c.font='700 22px M';c.fillStyle='rgba(229,57,53,0.9)';c.fillText('PROTOTYPE · NON VALIDÉ',W-60,244);}c.restore();}
function tag(c,s,y,a,kind='rouge',size=40){if(a<=0)return;const bg={rouge:'rgba(229,57,53,0.95)',vert:'rgba(34,197,94,0.95)',sombre:'rgba(8,11,16,0.82)'}[kind];c.save();c.globalAlpha=a;let fs=size;c.font=`800 ${fs}px M`;c.letterSpacing='4px';while(c.measureText(s).width>940&&fs>22){fs-=2;c.font=`800 ${fs}px M`;}
  const w=c.measureText(s).width+64,yy=y+(1-eout(a))*14;c.fillStyle=bg;c.fillRect(W/2-w/2,yy-fs*0.9,w,fs*1.8);c.fillStyle=PAL.blanc;c.textAlign='center';c.textBaseline='middle';c.fillText(s,W/2,yy+2);c.restore();}
function title(c,kicker,lines,a,y=330){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.textBaseline='middle';c.font='800 34px M';c.letterSpacing='12px';c.fillStyle='rgba(245,245,245,0.9)';c.fillText(kicker,W/2+6,y);c.letterSpacing='0px';
  c.fillStyle=PAL.rouge;c.fillRect(W/2-46,y+36,92,6);c.font='800 78px M';c.fillStyle=PAL.blanc;c.shadowColor='rgba(0,0,0,0.8)';c.shadowBlur=24;lines.forEach((l,i)=>c.fillText(l,W/2,y+135+i*92));c.restore();}
const RED_W=new Set(['feu','fumer','fumer…','flammes','jamais','eau','boule','danger']),GREEN_W=new Set(['coupe','sors','112','couvercle']);
function captions(c,T){const cp=CAPS.find(x=>T>=x.s&&T<x.e);if(!cp)return;const k=clamp((T-cp.s)/0.12);c.save();c.globalAlpha=k;c.font='800 60px M';c.textBaseline='middle';c.lineJoin='round';
  const sp=c.measureText(' ').width;const lines=[[]];let lw=0;for(const tk of cp.toks){const w=c.measureText(tk.w).width;if(lw+w>860&&lines[lines.length-1].length){lines.push([]);lw=0;}lines[lines.length-1].push({w:tk.w,width:w});lw+=w+sp;}
  lines.slice(0,2).forEach((ln,i,arr)=>{const tot=ln.reduce((s,x)=>s+x.width,0)+sp*(ln.length-1);let x=W/2-tot/2;const y=1520+(i-(arr.length-1)/2)*76;
    for(const tk of ln){const bare=tk.w.toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿ0-9…]/g,'');const col=RED_W.has(bare)?PAL.rouge:GREEN_W.has(bare)?PAL.vert:PAL.blanc;c.textAlign='left';c.lineWidth=12;c.strokeStyle='rgba(0,0,0,0.92)';c.strokeText(tk.w,x,y);c.fillStyle=col;c.fillText(tk.w,x,y);x+=tk.width+sp;}});c.restore();}
// rendu d'une image : SCENES[si](c, t local, durée, T global)
function render(T,si,lt,dur){ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='none';ctx.clearRect(0,0,W,H);
  ctx.save();SCENES[si](ctx,lt,dur,T);ctx.restore();marks(ctx);captions(ctx,T);return cv.toDataURL('image/jpeg',0.93);}
window.READY=document.fonts.load('800 74px M').then(()=>document.fonts.load('600 26px M')).then(()=>true);
