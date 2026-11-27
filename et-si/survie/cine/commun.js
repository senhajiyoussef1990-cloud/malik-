/* ET SI ? — éléments communs aux épisodes cinéma (bandeaux, flèches, téléphone, cartes, boutons). */
const cutsOf=(d,list)=>{const o=[0];for(const x of list)o.push(clamp(Math.max(x,o[o.length-1]+0.7),0,d-0.4));o.push(d);return o;};
function pick(t,cs){for(let i=0;i<cs.length-1;i++)if(t<cs[i+1])return [i,t-cs[i],cs[i+1]-cs[i]];const n=cs.length-2;return [n,t-cs[n],cs[n+1]-cs[n]];}
const C=(k,d)=>CUE(k,d);
function xMark(c,x,y,r,a){if(a<=0)return;c.save();c.globalAlpha=a;c.strokeStyle=PAL.rouge;c.lineWidth=r*0.22;c.lineCap='round';c.shadowColor='rgba(0,0,0,0.6)';c.shadowBlur=18;
  const k=eout(a);c.beginPath();c.moveTo(x-r*k,y-r*k);c.lineTo(x+r*k,y+r*k);c.moveTo(x+r*k,y-r*k);c.lineTo(x-r*k,y+r*k);c.stroke();c.restore();}
function dashArrow(c,pts,a,col,w=10){if(a<=0)return;c.save();c.globalAlpha=Math.min(1,a*2);c.strokeStyle=col;c.fillStyle=col;c.lineWidth=w;c.lineCap='round';c.setLineDash([w*2.2,w*1.6]);
  const n=pts.length-1,k=clamp(a)*n;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);let end=pts[0],prev=pts[0];
  for(let i=1;i<=n;i++){const q=clamp(k-(i-1));if(q<=0)break;const p=[lerp(pts[i-1][0],pts[i][0],q),lerp(pts[i-1][1],pts[i][1],q)];c.lineTo(p[0],p[1]);prev=pts[i-1];end=p;}
  c.stroke();c.setLineDash([]);const an=Math.atan2(end[1]-prev[1],end[0]-prev[0]);c.translate(end[0],end[1]);c.rotate(an);c.beginPath();c.moveTo(w*2.6,0);c.lineTo(-w*1.4,-w*2);c.lineTo(-w*1.4,w*2);c.closePath();c.fill();c.restore();}
function show(c,B,cam,blur=0){c.save();camXf(c,cam);if(blur)c.filter=`blur(${blur}px)`;c.drawImage(B,0,0);c.restore();}
function topShade(c,h=820){c.fillStyle=lg(c,0,0,0,h,[[0,'rgba(8,11,16,0.85)'],[1,'rgba(8,11,16,0)']]);c.fillRect(0,0,W,h);}
function signature(c,t,t0){const k=clamp((t-t0)/0.35);if(k<=0)return;c.save();c.globalAlpha=k;const y=720+(1-eout(k))*20;
  c.fillStyle='rgba(8,11,16,0.78)';c.fillRect(W/2-460,y-58,920,116);c.fillStyle=PAL.rouge;c.fillRect(W/2-460,y-58,10,116);
  c.font='800 50px M';c.letterSpacing='1px';c.fillStyle=PAL.blanc;c.textAlign='center';c.textBaseline='middle';c.fillText(SIGNATURE,W/2+6,y+2);c.restore();}
function phone(c,x,y,a,call,s=1){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);c.fillStyle='#0d0f12';c.beginPath();c.roundRect(-46,-90,92,180,16);c.fill();c.fillStyle='#1d2a3a';c.beginPath();c.roundRect(-38,-78,76,156,10);c.fill();
  c.font='800 34px M';c.fillStyle=PAL.blanc;c.textAlign='center';c.fillText('112',0,-20);c.fillStyle=PAL.vert;c.beginPath();c.arc(0,36,18*(1+0.15*Math.sin(call*12)),0,TAU);c.fill();c.restore();}
function bubble(c,x,y,s,a){if(a<=0)return;c.save();c.globalAlpha=a;const k=eout(a);c.translate(x,y);c.scale(k,k);c.font='900 52px M';const w=c.measureText(s).width+60;
  c.fillStyle=PAL.blanc;c.beginPath();c.roundRect(-w/2,-50,w,100,22);c.fill();c.beginPath();c.moveTo(-w/2+40,40);c.lineTo(-w/2+20,90);c.lineTo(-w/2+90,44);c.fill();c.fillStyle=PAL.rouge;c.textAlign='center';c.textBaseline='middle';c.fillText(s,0,4);c.restore();}
function darkBg(c){c.fillStyle=lg(c,0,0,0,H,[[0,PAL.noir],[1,PAL.nuit]]);c.fillRect(0,0,W,H);c.save();c.strokeStyle='rgba(245,245,245,0.05)';c.lineWidth=2;for(let x=0;x<W;x+=60){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=60){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}c.restore();}
function kicker(c,s,y,a){if(a<=0)return;c.save();c.globalAlpha=a;c.font='800 30px M';c.letterSpacing='8px';c.fillStyle='rgba(245,245,245,0.7)';c.textAlign='center';c.fillText(s,W/2,y);c.restore();}
function card(c,y,a,txt,icon,col){if(a<=0)return;c.save();c.globalAlpha=a;const x=W/2+(1-eout(a))*80;c.fillStyle='rgba(16,24,36,0.92)';c.beginPath();c.roundRect(x-450,y-110,900,220,28);c.fill();c.fillStyle=col;c.fillRect(x-450,y-110,14,220);
  c.save();c.translate(x-320,y);icon(c);c.restore();c.font='800 48px M';c.fillStyle=PAL.blanc;c.textAlign='left';c.textBaseline='middle';const ls=txt.split('\n');ls.forEach((l,i)=>c.fillText(l,x-190,y+(i-(ls.length-1)/2)*58));c.restore();}
function button(c,s,y,a,fill){if(a<=0)return;c.save();c.globalAlpha=a;const k=0.9+0.1*eout(a);c.translate(W/2,y);c.scale(k,k);c.font='800 44px M';c.letterSpacing='3px';const w=c.measureText(s).width+120;
  c.fillStyle=fill?PAL.rouge:'rgba(0,0,0,0)';c.strokeStyle=PAL.blanc;c.lineWidth=5;c.beginPath();c.roundRect(-w/2,-50,w,100,50);fill?c.fill():c.stroke();c.fillStyle=PAL.blanc;c.textAlign='center';c.textBaseline='middle';c.fillText(s,0,3);c.restore();}
function lab(c,s,x,y,a,col=PAL.blanc,al='left',fs=36){if(a<=0)return;c.save();c.globalAlpha=a;c.font=`700 ${fs}px M`;c.fillStyle=col;c.textAlign=al;c.shadowColor='#000';c.shadowBlur=10;c.fillText(s,x,y);c.restore();}
// eau -> vapeur -> projection d'huile brûlante (tv : vaporisation, tp : projection, temps locaux)
function reach(c,S,Wt,u,hand,ang,bend){const r=ik(S,Wt,ARM_A*u,ARM_B*u,bend);limbDraw(c,S,r.E,r.W,u,MAN,true,hand,ang??r.fa);}
