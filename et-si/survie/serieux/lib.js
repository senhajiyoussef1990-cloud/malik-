let TITRE='Et si ?';function setTitre(t){if(t)TITRE=t;}
/* Et si ? — style « sérieux » : bibliothèque de dessin commune.
   Décors éclairés (lumière du feu / lampe), personnages articulés vus de profil avec
   éclairage de contour, textes sobres, sous-titres. Chaque épisode définit SCENES. */
const W=1080,H=1920,TAU=Math.PI*2;
const cv=document.getElementById('c');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');
let CUES={},CAPS=[],DRAFT=false;
function setCues(c){CUES=c;} function CUE(k,d){return CUES[k]!=null?CUES[k]:d;}
function setCaptions(c){CAPS=c;} function setDraft(b){DRAFT=b;}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,eout=t=>1-Math.pow(1-t,3);
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const POOL=[];function buf(i){if(!POOL[i]){const c=document.createElement('canvas');c.width=W;c.height=H;POOL[i]=c;}const c=POOL[i];const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.filter='none';x.clearRect(0,0,W,H);return c;}
function lg(c,x0,y0,x1,y1,s){const g=c.createLinearGradient(x0,y0,x1,y1);s.forEach(([o,col])=>g.addColorStop(o,col));return g;}
function rg(c,x,y,r0,r1,s){const g=c.createRadialGradient(x,y,r0,x,y,r1);s.forEach(([o,col])=>g.addColorStop(o,col));return g;}
function noiseTex(w,h,amp,seed){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),im=x.createImageData(w,h),r=mulberry(seed);for(let i=0;i<im.data.length;i+=4){const v=128+(r()-0.5)*amp;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}x.putImageData(im,0,0);return c;}
const GRAIN=noiseTex(540,540,70,9),STONE=noiseTex(300,60,60,3);
function tile(c,tex,a,op,x=0,y=0,w=W,h=H,ox=0,oy=0){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.globalAlpha=a;c.globalCompositeOperation=op;for(let yy=y-oy;yy<y+h;yy+=tex.height)for(let xx=x-ox;xx<x+w;xx+=tex.width)c.drawImage(tex,xx,yy);c.restore();}
function camera(c,t,d,z0,z1,cx,cy,dx=0,dy=0){const k=eout(clamp(t/d));const z=lerp(z0,z1,k);c.translate(cx+dx*k,cy+dy*k);c.scale(z,z);c.translate(-cx,-cy);}

/* ---------- feu, fumée ---------- */
function fireLayer(c,x,y,w,h,t,int=1){const r=mulberry(1);
  const tongue=(fx,hh,bw,col,sw)=>{c.fillStyle=col;c.beginPath();c.moveTo(fx-bw,y);c.bezierCurveTo(fx-bw*1.1,y-hh*0.45,fx+sw-bw*0.45,y-hh*0.75,fx+sw*1.4,y-hh);c.bezierCurveTo(fx+sw+bw*0.3,y-hh*0.7,fx+bw*1.05,y-hh*0.4,fx+bw,y);c.fill();};
  c.globalCompositeOperation='lighter';
  const cols=['rgba(190,40,10,0.55)','rgba(255,95,20,0.55)','rgba(255,170,60,0.55)','rgba(255,240,190,0.6)'];
  for(let L=0;L<4;L++){const s=[1,0.82,0.6,0.36][L];for(let i=0;i<11;i++){const u=i/10-0.5;const fx=x+u*w*0.9*s+(r()-0.5)*20;const env=Math.pow(Math.max(0,1-Math.abs(u)*1.6),1.2);if(env<=0)continue;
    tongue(fx,h*s*env*int*(0.55+0.45*Math.abs(Math.sin(t*4.3+i*1.9+L))),w*0.09*s*(0.8+r()*0.5),cols[L],Math.sin(t*6+i*2.3+L)*w*0.05);}}
  for(let i=0;i<40*int;i++){const ph=(t*0.5+r())%1;c.fillStyle=`rgba(255,${150+r()*80|0},60,${(1-ph)*0.9})`;c.beginPath();c.arc(x+(r()-0.5)*w*0.8+Math.sin(ph*9+i)*30,y-ph*h*1.6,1.5+r()*2.5,0,TAU);c.fill();}
  c.globalCompositeOperation='source-over';}
function fire(c,x,y,w,h,t,int=1){if(int<=0.01)return;const F=buf(20),f=F.getContext('2d');fireLayer(f,x,y,w,h,t,int);
  c.save();c.globalCompositeOperation='lighter';c.filter='blur(28px)';c.globalAlpha=0.9;c.drawImage(F,0,0);c.filter='blur(8px)';c.globalAlpha=0.7;c.drawImage(F,0,0);c.filter='none';c.globalAlpha=1;c.drawImage(F,0,0);c.restore();}
function smoke(c,x,y,w,t,n,a=0.5,col='30,30,34'){const r=mulberry(4);c.save();c.filter='blur(30px)';for(let i=0;i<n;i++){const ph=(t*0.12+r())%1;c.fillStyle=`rgba(${col},${a*(1-ph)*(0.5+r()*0.5)})`;c.beginPath();c.arc(x+(r()-0.5)*w+ph*80*(r()-0.3),y-ph*600,80+ph*220,0,TAU);c.fill();}c.restore();}

/* ---------- lumière ---------- */
function lightmap(lights,amb='#262a33'){const L=buf(21),c=L.getContext('2d');c.fillStyle=amb;c.fillRect(0,0,W,H);c.globalCompositeOperation='lighter';
  for(const l of lights){c.fillStyle=rg(c,l.x,l.y,0,l.r,[[0,l.c0],[0.3,l.c1||l.c0],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,W,H);}return L;}
const FIRE_L=(x,y,k=1)=>({x,y,r:1100*k,c0:`rgba(255,170,90,${k})`,c1:`rgba(230,110,40,${0.7*k})`});
const LAMP_L=(x,y,k=1)=>({x,y,r:1000*k,c0:`rgba(255,225,180,${k})`,c1:`rgba(220,170,120,${0.6*k})`});
function applyLight(c,L){c.save();c.globalCompositeOperation='multiply';c.drawImage(L,0,0);c.restore();c.save();c.globalCompositeOperation='screen';c.globalAlpha=0.08;c.drawImage(L,0,0);c.restore();}

/* ---------- personnages articulés (vue de profil) ---------- */
// angles en radians. Membres : 0 = vers le bas, + = vers l'avant. Torse : 0 = droit, + = penché en avant.
const POSES={
  stand:{torso:0,head:0,armF:[0.05,0.1],armB:[-0.05,0.05],legF:[0.03,0],legB:[-0.03,0]},
};
function P(o){return Object.assign({},POSES.stand,o);}
function lerpPose(a,b,k){const o={};for(const key of Object.keys(b)){const va=a[key]??POSES.stand[key],vb=b[key];o[key]=Array.isArray(vb)?vb.map((v,i)=>lerp(va[i],v,k)):(typeof vb==='number'?lerp(va,vb,k):vb);}return o;}
function capsule(c,ax,ay,bx,by,w1,w2){const a=Math.atan2(by-ay,bx-ax),nx=-Math.sin(a),ny=Math.cos(a);c.beginPath();c.moveTo(ax+nx*w1/2,ay+ny*w1/2);c.lineTo(bx+nx*w2/2,by+ny*w2/2);c.arc(bx,by,w2/2,a+Math.PI/2,a-Math.PI/2,true);c.lineTo(ax-nx*w1/2,ay-ny*w1/2);c.arc(ax,ay,w1/2,a-Math.PI/2,a+Math.PI/2,true);c.fill();}
function skeleton(s){ // s:{x,y,h,dir,pose,hip?}
  const u=s.h/8,p=s.pose,d=s.dir||1;const V=(a,l)=>[Math.sin(a)*l*d,Math.cos(a)*l];
  const legLen=3.9*u;let hip=s.hip?[s.x+s.hip[0]*d,s.y+s.hip[1]]:[s.x,s.y-legLen*Math.cos((p.legF[0]+p.legB[0])/2)];
  const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
  const tUp=[Math.sin(p.torso)*d,-Math.cos(p.torso)];
  const sh=[hip[0]+tUp[0]*2.75*u,hip[1]+tUp[1]*2.75*u],neck=[hip[0]+tUp[0]*3.1*u,hip[1]+tUp[1]*3.1*u];
  const ha=p.torso+(p.head||0);const head=[neck[0]+Math.sin(ha)*d*0.62*u,neck[1]-Math.cos(ha)*0.62*u];
  const limb=(o,[a1,a2],l1,l2)=>{const e=add(o,V(a1,l1));const w=add(e,V(a2,l2));return[o,e,w];};
  return {u,d,hip,sh,neck,head,ha,
    armF:limb(sh,p.armF,1.45*u,1.3*u),armB:limb(sh,p.armB,1.45*u,1.3*u),
    legF:limb(hip,p.legF,1.95*u,1.9*u),legB:limb(hip,p.legB,1.95*u,1.9*u)};}
function drawFig(c,s,col,maskOnly=false){const k=skeleton(s),u=k.u,d=k.d;const C=maskOnly?{shirt:'#fff',shirtB:'#fff',pants:'#fff',pantsB:'#fff',skin:'#fff',skinB:'#fff',hair:'#fff',shoe:'#fff'}:col;
  const leg=(L,cP,cS)=>{c.fillStyle=cP;capsule(c,...L[0],...L[1],0.62*u,0.48*u);capsule(c,...L[1],...L[2],0.48*u,0.34*u);c.fillStyle=cS;c.beginPath();c.ellipse(L[2][0]+0.22*u*d,L[2][1]+0.06*u,0.42*u,0.17*u,0,0,TAU);c.fill();};
  const arm=(A,cS,cK)=>{c.fillStyle=cS;capsule(c,...A[0],...A[1],0.42*u,0.34*u);c.fillStyle=cK;capsule(c,...A[1],...A[2],0.32*u,0.27*u);c.beginPath();c.ellipse(A[2][0],A[2][1],0.17*u,0.17*u,0,0,TAU);c.fill();
    c.fillStyle=cS;capsule(c,...A[1],...[lerp(A[1][0],A[2][0],0.45),lerp(A[1][1],A[2][1],0.45)],0.36*u,0.33*u);};
  if(s.only==='armF'){arm(k.armF,C.shirt,C.skin);return k;}
  leg(k.legB,C.pantsB,C.shoe);arm(k.armB,C.shirtB,C.skinB);
  // torse
  c.fillStyle=C.pants;capsule(c,...k.hip,...[lerp(k.hip[0],k.sh[0],0.25),lerp(k.hip[1],k.sh[1],0.25)],1.0*u,0.98*u);
  c.fillStyle=C.shirt;capsule(c,...[lerp(k.hip[0],k.sh[0],0.18),lerp(k.hip[1],k.sh[1],0.18)],...k.sh,0.98*u,1.08*u);
  c.fillStyle=C.skin;capsule(c,...k.sh,...k.neck,0.38*u,0.36*u);
  // tête de profil
  c.save();c.translate(...k.head);c.rotate(k.ha*d);c.fillStyle=C.skin;c.beginPath();c.ellipse(0,0,0.5*u,0.6*u,0,0,TAU);c.fill();
  c.beginPath();c.moveTo(0.42*u*d,-0.08*u);c.lineTo(0.62*u*d,0.08*u);c.lineTo(0.44*u*d,0.16*u);c.fill(); // nez
  c.fillStyle=C.hair;c.beginPath();c.ellipse(-0.06*u*d,-0.2*u,0.52*u,0.44*u,0,Math.PI*0.95,Math.PI*2.05);c.fill();c.beginPath();c.ellipse(-0.3*u*d,-0.02*u,0.24*u,0.36*u,0,0,TAU);c.fill();
  c.restore();
  leg(k.legF,C.pants,C.shoe);if(s.skip!=='armF')arm(k.armF,C.shirt,C.skin);
  return k;}
// cinématique inverse : angles [épaule, coude] pour que la main atteigne target
function ikArm(s,target,bend=1,which='armF'){const k=skeleton(s),u=k.u,d=k.d,sh=k.sh,l1=1.45*u,l2=1.3*u+0.17*u;
  const lx=(target[0]-sh[0])*d,ly=target[1]-sh[1];let D=Math.hypot(lx,ly);D=Math.min(D,l1+l2-1);const base=Math.atan2(lx,ly);
  const al=Math.acos(clamp((l1*l1+D*D-l2*l2)/(2*l1*D),-1,1));const a1=base+bend*al;const ex=Math.sin(a1)*l1,ey=Math.cos(a1)*l1;const a2=Math.atan2(lx-ex,ly-ey);return [a1,a2];}
// points du corps (repère monde)
function bodyPts(s){const k=skeleton(s),u=k.u,d=k.d,t=s.pose.torso;const up=[Math.sin(t)*d,-Math.cos(t)],fw=[Math.cos(t)*d,Math.sin(t)];
  const at=(a,f)=>[k.hip[0]+up[0]*a*u+fw[0]*f*u,k.hip[1]+up[1]*a*u+fw[1]*f*u];
  return {k,chest:at(2.1,0.55),back:at(2.35,-0.55),abdo:at(1.25,0.5),navel:at(0.9,0.5),sternum:at(1.7,0.52),up,fw};}
const COL={
  homme:{shirt:'#3a4a66',shirtB:'#2b374d',pants:'#22262e',pantsB:'#191c22',skin:'#b07e62',skinB:'#8c624b',hair:'#1b1512',shoe:'#121212'},
  victime:{shirt:'#7a3434',shirtB:'#5c2626',pants:'#2a2a30',pantsB:'#1d1d22',skin:'#c08a6a',skinB:'#976a50',hair:'#3a2a1e',shoe:'#151515'},
  femme:{shirt:'#4f6b5a',shirtB:'#3c5345',pants:'#2b2f38',pantsB:'#1f222a',skin:'#c99474',skinB:'#a0715a',hair:'#2a1a12',shoe:'#151515'},
  enfant:{shirt:'#c48a2e',shirtB:'#9a6a20',pants:'#2b3442',pantsB:'#1f2632',skin:'#c99474',skinB:'#a0715a',hair:'#20160f',shoe:'#151515'},
};
// dessine un personnage dans c et renvoie un masque pour l'éclairage de contour
function person(c,s,col,maskIdx){drawFig(c,s,col);if(maskIdx==null)return null;const M=buf(maskIdx),m=M.getContext('2d');drawFig(m,s,null,true);return M;}
function rimLight(c,M,color,dx,dy,blur=3){const R=buf(19),r=R.getContext('2d');r.drawImage(M,0,0);r.globalCompositeOperation='destination-out';r.drawImage(M,-dx,-dy);r.globalCompositeOperation='source-in';r.fillStyle=color;r.fillRect(0,0,W,H);
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=0.5;c.filter=`blur(${blur}px)`;c.drawImage(R,0,0);c.filter='none';c.globalAlpha=0.35;c.drawImage(R,0,0);c.restore();}
function groundShadow(c,x,y,w){c.save();c.fillStyle='rgba(0,0,0,0.45)';c.filter='blur(12px)';c.beginPath();c.ellipse(x,y+6,w,w*0.12,0,0,TAU);c.fill();c.restore();}

/* ---------- cuisine ---------- */
const CT=1180;
function cab(c,x,y,w,h){c.fillStyle=lg(c,x,0,x+w,0,[[0,'#6e4f35'],[0.5,'#7d5b3e'],[1,'#6a4b31']]);c.fillRect(x,y,w,h);const rr=mulberry(x+7);c.strokeStyle='rgba(40,25,10,0.18)';c.lineWidth=2;for(let i=0;i<14;i++){const xx=x+rr()*w;c.beginPath();c.moveTo(xx,y);c.bezierCurveTo(xx+6,y+h*0.3,xx-6,y+h*0.6,xx+3,y+h);c.stroke();}
  c.strokeStyle='rgba(0,0,0,0.35)';c.lineWidth=4;c.strokeRect(x+14,y+14,w-28,h-28);c.fillStyle=lg(c,0,y,0,y+h,[[0,'#ddd'],[1,'#888']]);c.fillRect(x+w-40,y+h-90,10,60);}
function knob(c,x,y,r,ang){c.save();c.shadowColor='rgba(0,0,0,0.6)';c.shadowBlur=10;c.shadowOffsetY=4;c.fillStyle=rg(c,x-r*0.3,y-r*0.3,2,r*1.2,[[0,'#f2f2f2'],[0.6,'#9a9ea3'],[1,'#4b4e52']]);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();
  c.strokeStyle='#1a1a1a';c.lineWidth=r*0.2;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(ang)*r*0.75,y-Math.cos(ang)*r*0.75);c.stroke();}
function pan(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=lg(c,0,-70,0,0,[[0,'#3c3f45'],[1,'#141518']]);c.beginPath();c.moveTo(-130,-70);c.lineTo(130,-70);c.lineTo(112,0);c.lineTo(-112,0);c.closePath();c.fill();
  c.fillStyle=lg(c,-130,0,130,0,[[0,'#55595f'],[0.5,'#9a9ea4'],[1,'#4a4e54']]);c.fillRect(-134,-76,268,10);c.fillStyle=lg(c,0,-66,0,-50,[[0,'#2b2d31'],[1,'#111']]);c.beginPath();c.roundRect(-330,-66,200,22,11);c.fill();c.restore();}
function kitchen(c,o={}){
  c.fillStyle=lg(c,0,0,0,CT,[[0,'#5d5a55'],[1,'#7a756d']]);c.fillRect(0,0,W,H);
  c.fillStyle='#0b1526';c.fillRect(70,560,300,400);c.fillStyle=lg(c,0,560,0,960,[[0,'#1d3150'],[1,'#0c1830']]);c.fillRect(82,572,276,376);
  const rs=mulberry(3);for(let i=0;i<30;i++){c.fillStyle=`rgba(255,220,150,${rs()*0.6})`;c.fillRect(90+rs()*260,800+rs()*140,4,6);}
  c.fillStyle='#d9d4ca';c.fillRect(214,572,12,376);c.fillRect(82,752,276,12);c.fillStyle='#cfc9bd';c.fillRect(60,955,320,22);
  const tx0=430,ty0=700;c.fillStyle='#bdb8ae';c.fillRect(tx0,ty0,W-tx0,CT-ty0);const rt=mulberry(8);
  for(let y=ty0,row=0;y<CT;y+=46,row++)for(let x=tx0-(row%2?48:0);x<W;x+=96){const v=230+(rt()-0.5)*14;c.fillStyle=`rgb(${v},${v-4},${v-12})`;c.fillRect(x+3,y+3,90,40);c.fillStyle='rgba(255,255,255,0.35)';c.fillRect(x+6,y+6,84,5);}
  cab(c,0,250,420,280);cab(c,860,250,220,430);
  c.fillStyle=lg(c,560,0,840,0,[[0,'#8d9196'],[0.35,'#d8dbde'],[0.55,'#aeb2b6'],[1,'#7c8085']]);c.fillRect(640,250,120,330);c.beginPath();c.moveTo(540,580);c.lineTo(860,580);c.lineTo(900,690);c.lineTo(500,690);c.closePath();c.fill();c.fillStyle='#2a2c30';c.fillRect(500,690,400,12);
  c.fillStyle=lg(c,0,CT-24,0,CT+36,[[0,'#d6d0c4'],[0.45,'#b9b2a5'],[1,'#8a8478']]);c.fillRect(0,CT-24,W,60);tile(c,STONE,0.25,'overlay',0,CT-24,W,60);c.fillStyle='rgba(255,255,255,0.4)';c.fillRect(0,CT-24,W,3);
  for(let x=0;x<W;x+=270){c.fillStyle=lg(c,x,0,x+270,0,[[0,'#3d4650'],[0.5,'#4a535e'],[1,'#3a434d']]);c.fillRect(x+4,CT+40,262,480);c.strokeStyle='rgba(0,0,0,0.4)';c.lineWidth=3;c.strokeRect(x+18,CT+58,234,444);c.fillStyle=lg(c,0,0,0,10,[[0,'#e5e5e5'],[1,'#8c8c8c']]);c.fillRect(x+90,CT+80,90,10);}
  c.fillStyle=lg(c,0,CT+40,0,CT+140,[[0,'#c9ccd0'],[1,'#8f9398']]);c.fillRect(540,CT+40,400,96);c.fillStyle='#15171a';c.fillRect(560,CT+150,360,300);
  for(let i=0;i<4;i++)knob(c,590+i*100,CT+88,26,(i===2&&o.knobOff!=null)?lerp(-0.9,0.9,o.knobOff):-0.9);
  c.fillStyle='#0c0d0f';c.fillRect(520,CT-38,440,16);c.strokeStyle='#202226';c.lineWidth=8;for(const gx of [560,750])c.strokeRect(gx,CT-62,170,26);
  c.fillStyle=lg(c,300,0,350,0,[[0,'rgba(190,150,30,0.85)'],[0.5,'rgba(240,200,80,0.9)'],[1,'rgba(170,130,20,0.85)']]);c.beginPath();c.roundRect(300,CT-200,50,176,10);c.fill();c.fillStyle='#2a6b2a';c.fillRect(312,CT-236,26,40);
  if(o.glass){c.fillStyle='rgba(170,210,240,0.35)';c.strokeStyle='rgba(230,240,255,0.8)';c.lineWidth=4;c.beginPath();c.moveTo(400,CT-150);c.lineTo(450,CT-150);c.lineTo(444,CT-26);c.lineTo(406,CT-26);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(120,180,230,0.6)';c.fillRect(408,CT-110,38,82);}
  c.fillStyle=lg(c,0,0,140,0,[[0,'#a77b4f'],[1,'#c4975f']]);c.beginPath();c.roundRect(990,CT-300,70,276,14);c.fill();
  c.fillStyle='#2b2723';c.fillRect(0,CT+520,W,H);c.strokeStyle='rgba(0,0,0,0.5)';c.lineWidth=3;for(let i=-10;i<20;i++){c.beginPath();c.moveTo(W/2+i*90,CT+520);c.lineTo(W/2+i*260,H);c.stroke();}
  pan(c,840,CT-62);}

/* ---------- habillage ---------- */
function post(c,t){c.fillStyle=rg(c,W/2,H*0.46,H*0.25,H*0.8,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.6)']]);c.fillRect(0,0,W,H);tile(c,GRAIN,0.07,'overlay',0,0,W,H,(t*997%540)|0,(t*613%540)|0);}
function topShade(c,h=760){c.fillStyle=lg(c,0,0,0,h,[[0,'rgba(0,0,0,0.78)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,W,h);}
function marks(c){c.save();c.font='600 28px M';c.fillStyle='rgba(255,255,255,0.6)';c.textAlign='left';c.textBaseline='alphabetic';c.fillText(TITRE,60,200);c.textAlign='right';c.fillText('SIMULATION',W-60,200);
  if(DRAFT){c.font='700 22px M';c.fillStyle='rgba(255,90,70,0.9)';c.fillText('BROUILLON · NON VALIDÉ',W-60,234);}c.restore();}
function fadeIn(t,t0,d=0.3){return clamp((t-t0)/d);}
function label(c,s,y,a,kind='red'){if(a<=0)return;const bg={red:'rgba(214,48,36,0.95)',yellow:'rgba(255,200,0,0.95)',green:'rgba(30,150,80,0.95)',dark:'rgba(10,12,16,0.85)'}[kind];const fg=kind==='yellow'?'#111':'#fff';
  c.save();c.globalAlpha=a;let fs=40;c.font=`700 ${fs}px M`;c.letterSpacing='4px';while(c.measureText(s).width>960&&fs>24){fs-=2;c.font=`700 ${fs}px M`;}const w=c.measureText(s).width+64;const yy=y+(1-eout(a))*16;c.fillStyle=bg;c.fillRect(W/2-w/2,yy-36,w,72);c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';c.fillText(s,W/2,yy+2);c.restore();}
function headline(c,kicker,lines,a,y=300){if(a<=0)return;c.save();c.globalAlpha=a;c.textAlign='center';c.textBaseline='middle';
  if(kicker){c.font='700 32px M';c.letterSpacing='10px';c.fillStyle='rgba(255,255,255,0.85)';c.fillText(kicker,W/2,y);c.letterSpacing='0px';c.fillStyle='#E8412C';c.fillRect(W/2-40,y+38,80,6);}
  c.font='800 74px M';c.fillStyle='#fff';c.shadowColor='rgba(0,0,0,0.7)';c.shadowBlur=20;lines.forEach((l,i)=>c.fillText(l,W/2,y+130+i*90));c.restore();}
function counter(c,n,total,y,a,label_){if(a<=0)return;c.save();c.globalAlpha=a;const gap=90,x0=W/2-(total-1)*gap/2;for(let i=0;i<total;i++){const on=i<n;c.beginPath();c.arc(x0+i*gap,y,30,0,TAU);c.fillStyle=on?'#fff':'rgba(255,255,255,0.12)';c.fill();c.strokeStyle='rgba(255,255,255,0.6)';c.lineWidth=3;c.stroke();
  c.fillStyle=on?'#111':'rgba(255,255,255,0.7)';c.font='800 30px M';c.textAlign='center';c.textBaseline='middle';c.fillText(String(i+1),x0+i*gap,y+2);}
  if(label_){c.font='600 30px M';c.fillStyle='rgba(255,255,255,0.85)';c.textAlign='center';c.fillText(label_,W/2,y+70);}c.restore();}
function drawCaption(c,T){const cp=CAPS.find(x=>T>=x.s&&T<x.e);if(!cp)return;const k=clamp((T-cp.s)/0.15);
  c.save();c.globalAlpha=k;c.font='700 58px M';c.textAlign='center';c.textBaseline='middle';const words=cp.toks.map(t=>t.w);const lines=[''];for(const w of words){const t=(lines[lines.length-1]+' '+w).trim();if(c.measureText(t).width>880)lines.push(w);else lines[lines.length-1]=t;}
  lines.forEach((l,i)=>{const y=1560+(i-(lines.length-1)/2)*72;c.shadowColor='rgba(0,0,0,0.95)';c.shadowBlur=18;c.fillStyle='#fff';c.fillText(l,W/2,y);c.shadowBlur=0;});c.restore();}
function outro(c,t,d,recap){
  c.fillStyle=lg(c,0,0,0,H,[[0,'#07090d'],[1,'#141922']]);c.fillRect(0,0,W,H);tile(c,GRAIN,0.06,'overlay');
  headline(c,'ET SI ?',['Tu sais quoi faire.'],fadeIn(t,0));
  recap.forEach((r,i)=>{const a=fadeIn(t,0.5+i*0.3);if(a<=0)return;c.save();c.globalAlpha=a;const y=700+i*120;c.fillStyle='rgba(255,255,255,0.06)';c.fillRect(140,y-48,800,96);c.fillStyle=r[1]==='x'?'#D63024':'#1E9650';c.fillRect(140,y-48,10,96);
    c.font='700 40px M';c.fillStyle='#fff';c.textAlign='left';c.textBaseline='middle';c.fillText(r[0],190,y+2);c.restore();});
  const btn=(s,y,t0,fill)=>{const a=fadeIn(t,t0);if(a<=0)return;c.save();c.globalAlpha=a;c.font='800 44px M';c.letterSpacing='4px';const w=520;c.fillStyle=fill?'#fff':'rgba(0,0,0,0)';c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.roundRect(W/2-w/2,y-55,w,110,55);fill?c.fill():c.stroke();c.fillStyle=fill?'#111':'#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(s,W/2,y+3);c.restore();};
  btn('PARTAGE',1150,CUE('partage',d-3),false);btn('ABONNE-TOI',1290,CUE('abonne',d-2),true);
  c.save();c.font='500 26px M';c.fillStyle='rgba(255,255,255,0.55)';c.textAlign='center';c.globalAlpha=fadeIn(t,1);c.fillText('Simulation éducative · sources officielles en description',W/2,1400);c.restore();}

function render(T,si,lt,dur){ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.filter='none';ctx.clearRect(0,0,W,H);
  ctx.save();SCENES[si](ctx,lt,dur,T);ctx.restore();
  const f=clamp(1-lt/0.25);if(f>0&&si>0){ctx.fillStyle=`rgba(0,0,0,${f*0.8})`;ctx.fillRect(0,0,W,H);}
  marks(ctx);drawCaption(ctx,T);return cv.toDataURL('image/jpeg',0.92);}
window.READY=document.fonts.load('800 74px M').then(()=>document.fonts.load('700 40px M')).then(()=>true);
