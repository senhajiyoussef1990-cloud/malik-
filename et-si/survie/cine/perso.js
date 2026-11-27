/* ET SI ? — personnage v2 : squelette à longueurs fixes (bras en cinématique inverse), mains simples,
   têtes au choix (STYLE_TETE : 'A' semi-réaliste doux, 'B' dessin animé, 'C' minimal sans traits).
   figure(c, x, y, u, pose, col) : x,y = base du cou ; u = taille d'une tête ; personnage de 3/4 vers la droite.
   pose = {lean, look (-1..1), ex:{eye, brow, mouth}, near:{to:[x,y] | rest, hand:'grip'|'open'|'rest'|'point', ang, bend},
           far:{...}, held:fn(c) (objet tenu, dessiné entre le corps et le bras avant)} */
let STYLE_TETE = 'B';
function setStyleTete(s){STYLE_TETE = s;}
const ARM_A = 1.12, ARM_B = 1.02; // longueurs bras / avant-bras (en u)
function ik(S, T, a, b, bend = 1){const dx = T[0]-S[0], dy = T[1]-S[1];let d = Math.hypot(dx, dy);const dd = clamp(d, Math.abs(a-b)+1e-3, a+b-1e-3);
  const base = Math.atan2(dy, dx), al = Math.acos(clamp((a*a+dd*dd-b*b)/(2*a*dd), -1, 1));const ang = base + bend*al;
  const E = [S[0]+Math.cos(ang)*a, S[1]+Math.sin(ang)*a];const k = dd/d||1;const W = [S[0]+dx*Math.min(1, k), S[1]+dy*Math.min(1, k)];
  // si la cible est hors de portée, le poignet s'arrête au bout du bras (pas d'étirement)
  const fa = Math.atan2(W[1]-E[1], W[0]-E[0]);return {E, W:[E[0]+Math.cos(fa)*b, E[1]+Math.sin(fa)*b], fa};}
function mitt(c, x, y, ang, u, type, col){const s = u;c.save();c.translate(x, y);c.rotate(ang);
  const sk = rgb(col.skin, 1.02), skD = rgb(col.skinD, 0.95);c.fillStyle = sk;c.strokeStyle = skD;c.lineWidth = 0.025*s;c.lineJoin = 'round';
  if(type === 'grip'){c.beginPath();c.ellipse(0.17*s, 0, 0.19*s, 0.15*s, 0, 0, TAU);c.fill();c.stroke();
    c.beginPath();for(let i = 0;i < 3;i++){c.moveTo(0.26*s, (-0.08+i*0.07)*s);c.lineTo(0.33*s, (-0.08+i*0.07)*s);}c.stroke();
    c.beginPath();c.ellipse(0.12*s, -0.13*s, 0.1*s, 0.055*s, -0.5, 0, TAU);c.fill();c.stroke();}
  else if(type === 'open'){c.beginPath();c.ellipse(0.16*s, 0, 0.17*s, 0.15*s, 0, 0, TAU);c.fill();
    for(let i = 0;i < 4;i++){const a = (-0.33+i*0.22);c.save();c.rotate(a*0.6);c.beginPath();c.roundRect(0.22*s, (-0.13+i*0.075)*s*0.0-0.035*s+(i-1.5)*0.075*s, 0.2*s-Math.abs(i-1.2)*0.03*s, 0.07*s, 0.035*s);c.fill();c.restore();}
    c.beginPath();c.save();c.rotate(-0.9);c.roundRect(0.08*s, -0.04*s, 0.17*s, 0.075*s, 0.037*s);c.restore();c.fill();}
  else if(type === 'point'){c.beginPath();c.ellipse(0.16*s, 0, 0.17*s, 0.14*s, 0, 0, TAU);c.fill();c.stroke();c.beginPath();c.roundRect(0.22*s, -0.06*s, 0.24*s, 0.075*s, 0.037*s);c.fill();}
  else {c.beginPath();c.ellipse(0.16*s, 0.02*s, 0.17*s, 0.13*s, 0.2, 0, TAU);c.fill();c.stroke();}
  c.restore();}
function limbDraw(c, S, E, W, u, col, front, hand, hang){const k = front ? 1 : 0.8;c.lineCap = 'round';c.lineJoin = 'round';
  // avant-bras puis bras (peau), manche courte par-dessus
  c.strokeStyle = rgb(col.skin, 0.96*k);c.lineWidth = 0.3*u;c.beginPath();c.moveTo(E[0], E[1]);c.lineTo(W[0], W[1]);c.stroke();
  c.lineWidth = 0.36*u;c.beginPath();c.moveTo(S[0], S[1]);c.lineTo(E[0], E[1]);c.stroke();
  const M = [lerp(S[0], E[0], 0.5), lerp(S[1], E[1], 0.5)];c.strokeStyle = rgb(col.shirt, 1.0*k);c.lineWidth = 0.5*u;c.beginPath();c.moveTo(S[0], S[1]);c.lineTo(M[0], M[1]);c.stroke();
  c.strokeStyle = rgb(col.shirtD, 0.9*k);c.lineWidth = 0.05*u;c.beginPath();const fa = Math.atan2(E[1]-S[1], E[0]-S[0]);c.moveTo(M[0]+Math.cos(fa+1.57)*0.25*u, M[1]+Math.sin(fa+1.57)*0.25*u);c.lineTo(M[0]-Math.cos(fa+1.57)*0.25*u, M[1]-Math.sin(fa+1.57)*0.25*u);c.stroke();
  mitt(c, W[0], W[1], hang, u, hand, front ? col : {...col, skin:col.skin.map(v=>v*0.85), skinD:col.skinD});}
function armOf(c, S, A, u, col, front, defAng){if(!A)return null;let W0, bend = A.bend ?? 1;
  if(A.to)W0 = A.to; else W0 = [S[0]+(front?0.15:-0.1)*u, S[1]+2.2*u];
  const r = ik(S, W0, ARM_A*u, ARM_B*u, bend);const hang = A.ang ?? r.fa;return {S, ...r, hand:A.hand||'rest', hang};}
function figure(c, x, y, u, p = {}, col = MAN){const lean = p.lean||0;c.save();
  // repère du corps (rotation autour du bassin)
  const piv = [x, y+2.6*u];const rot = (q)=>{const dx = q[0]-piv[0], dy = q[1]-piv[1], cs = Math.cos(lean), sn = Math.sin(lean);return [piv[0]+dx*cs-dy*sn, piv[1]+dx*sn+dy*cs];};
  const nk = rot([x, y]), sN = rot([x+0.56*u, y+0.34*u]), sF = rot([x-0.52*u, y+0.32*u]);
  const far = armOf(c, sF, p.far === undefined ? {} : p.far, u, col, false), near = armOf(c, sN, p.near === undefined ? {} : p.near, u, col, true);
  if(far && !p.defer && !p.farFront)limbDraw(c, far.S, far.E, far.W, u, col, false, far.hand, far.hang);
  if(p.legs){c.save();const ly = y+3.25*u, L = p.legLen ?? 3.1*u;
    c.fillStyle = rgb(col.pants || [44, 50, 62], 0.85);c.beginPath();c.roundRect(x-0.5*u, ly-0.2*u, 0.5*u, L, 0.18*u);c.fill();
    c.fillStyle = rgb(col.pants || [44, 50, 62], 1);c.beginPath();c.roundRect(x+0.02*u, ly-0.2*u, 0.52*u, L, 0.18*u);c.fill();
    c.fillStyle = '#16181c';c.beginPath();c.roundRect(x-0.52*u, ly+L-0.25*u, 0.66*u, 0.28*u, 0.12*u);c.roundRect(x+0.0*u, ly+L-0.25*u, 0.72*u, 0.3*u, 0.12*u);c.fill();c.restore();}
  // torse
  c.save();c.translate(piv[0], piv[1]);c.rotate(lean);c.translate(-piv[0], -piv[1]);
  c.fillStyle = lg(c, x-0.8*u, 0, x+0.8*u, 0, [[0, rgb(col.shirtD, 0.95)], [0.45, rgb(col.shirt, 1.0)], [1, rgb(col.shirt, 1.1)]]);
  c.beginPath();c.moveTo(x-0.22*u, y);c.bezierCurveTo(x-0.6*u, y+0.02*u, x-0.82*u, y+0.12*u, x-0.82*u, y+0.48*u);c.bezierCurveTo(x-0.82*u, y+1.1*u, x-0.6*u, y+1.7*u, x-0.58*u, y+2.3*u);c.lineTo(x-0.6*u, y+3.4*u);c.lineTo(x+0.64*u, y+3.4*u);
  c.lineTo(x+0.62*u, y+2.3*u);c.bezierCurveTo(x+0.64*u, y+1.7*u, x+0.88*u, y+1.1*u, x+0.86*u, y+0.48*u);c.bezierCurveTo(x+0.86*u, y+0.12*u, x+0.62*u, y+0.02*u, x+0.24*u, y);c.closePath();c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.14)';c.lineWidth = 0.05*u;c.lineCap = 'round';c.beginPath();c.moveTo(x-0.3*u, y+1.2*u);c.quadraticCurveTo(x-0.1*u, y+1.6*u, x-0.32*u, y+2.1*u);c.stroke();
  // cou + col
  c.fillStyle = rgb(col.skinD, 1.05);c.beginPath();c.roundRect(x-0.16*u, y-0.28*u, 0.34*u, 0.38*u, 0.1*u);c.fill();
  c.fillStyle = rgb(col.shirtD, 0.8);c.beginPath();c.ellipse(x+0.02*u, y+0.02*u, 0.24*u, 0.08*u, 0, 0, Math.PI);c.fill();
  c.restore();
  const hc = rot([x+0.04*u+(p.headDX||0)*u, y-0.72*u]);head2(c, hc[0], hc[1], u, p.ex||{}, p.look??0.6, col, p.tilt||0);
  if(far && !p.defer && p.farFront)limbDraw(c, far.S, far.E, far.W, u, col, false, far.hand, far.hang);
  if(p.held)p.held(c);
  if(near && !p.defer)limbDraw(c, near.S, near.E, near.W, u, col, true, near.hand, near.hang);
  c.restore();return {near, far, rot, u, col};}
// bras différés (p.defer) : à dessiner après un autre personnage, par ex. bras autour de la victime
function drawArm(c, A, u, col, front = true){if(A)limbDraw(c, A.S, A.E, A.W, u, col, front, A.hand, A.hang);}
// tête : centre (x,y) ; u = hauteur de tête
function head2(c, x, y, u, ex, look, col, tilt){const eye = ex.eye ?? 0.6, brow = ex.brow ?? 0, mouth = ex.mouth ?? 0, st = STYLE_TETE;
  c.save();c.translate(x, y);c.rotate(tilt);const s = u*1.3;
  // oreille
  c.fillStyle = rgb(col.skin, 0.92);c.beginPath();c.ellipse(-0.2*s, 0.03*s, 0.07*s, 0.1*s, 0.1, 0, TAU);c.fill();c.fillStyle = rgb(col.skinD, 0.9);c.beginPath();c.ellipse(-0.2*s, 0.03*s, 0.035*s, 0.06*s, 0.1, 0, TAU);c.fill();
  if(col.longHair){c.fillStyle = col.hair;c.beginPath();c.ellipse(-0.08*s, 0.1*s, 0.36*s, 0.48*s, 0.15, 0, TAU);c.fill();}
  // visage : ovale de 3/4
  const face = new Path2D();face.ellipse(0.06*s, 0, 0.34*s, 0.43*s, 0, 0, TAU);face.ellipse(0.16*s, 0.2*s, 0.22*s, 0.2*s, 0, 0, TAU);
  c.fillStyle = lg(c, -0.3*s, 0, 0.45*s, 0, [[0, rgb(col.skinD, 1.08)], [0.35, rgb(col.skin, 1.0)], [1, rgb(col.skin, 1.06)]]);c.fill(face);
  if(st === 'A'){c.save();c.clip(face);c.fillStyle = 'rgba(200,110,90,0.18)';c.beginPath();c.ellipse(0.26*s, 0.14*s, 0.09*s, 0.06*s, 0, 0, TAU);c.fill();
    if(col.beard){c.fillStyle = 'rgba(35,24,18,0.38)';c.beginPath();c.ellipse(0.18*s, 0.32*s, 0.26*s, 0.15*s, 0, 0, TAU);c.fill();}c.restore();}
  // cheveux
  c.fillStyle = col.hair;c.beginPath();c.moveTo(-0.26*s, 0.06*s);c.bezierCurveTo(-0.36*s, -0.4*s, 0.1*s, -0.6*s, 0.38*s, -0.24*s);c.bezierCurveTo(0.3*s, -0.26*s, 0.2*s, -0.24*s, 0.12*s, -0.2*s);
  c.bezierCurveTo(0.0*s, -0.16*s, -0.12*s, -0.12*s, -0.16*s, 0.04*s);c.closePath();c.fill();
  if(st === 'C'){c.restore();return;}
  // yeux
  const lk = look*0.03*s, eh = (0.035+0.04*eye)*s;const eyeAt = (ex0, w)=>{c.fillStyle = '#f4efe9';c.beginPath();c.ellipse(ex0, -0.02*s, w, eh, 0, 0, TAU);c.fill();
    c.fillStyle = st === 'B' ? '#1b120c' : col.eye;c.beginPath();c.arc(ex0+lk, -0.02*s, Math.min(w, eh)*0.85, 0, TAU);c.fill();
    if(st === 'A'){c.fillStyle = '#0b0705';c.beginPath();c.arc(ex0+lk, -0.02*s, Math.min(w, eh)*0.4, 0, TAU);c.fill();}
    c.fillStyle = 'rgba(255,255,255,0.9)';c.beginPath();c.arc(ex0+lk+0.012*s, -0.035*s, 0.012*s, 0, TAU);c.fill();
    c.strokeStyle = 'rgba(30,18,12,0.7)';c.lineWidth = 0.014*s;c.beginPath();c.ellipse(ex0, -0.02*s, w, eh, 0, Math.PI*1.1, Math.PI*1.9);c.stroke();};
  eyeAt(0.13*s, 0.055*s);eyeAt(0.33*s, 0.042*s);
  // sourcils
  c.strokeStyle = col.hair;c.lineCap = 'round';c.lineWidth = 0.032*s;const by = -0.12*s-brow*0.04*s;
  c.beginPath();c.moveTo(0.07*s, by+0.01*s);c.quadraticCurveTo(0.13*s, by-0.03*s-brow*0.01*s, 0.2*s, by);c.stroke();c.beginPath();c.moveTo(0.28*s, by);c.quadraticCurveTo(0.33*s, by-0.025*s, 0.38*s, by+0.005*s);c.stroke();
  // nez
  c.strokeStyle = rgb(col.skinD, 0.95);c.lineWidth = 0.02*s;c.beginPath();c.moveTo(0.3*s, 0.02*s);c.quadraticCurveTo(0.4*s, 0.12*s, 0.31*s, 0.15*s);c.stroke();
  // bouche
  if(mouth > 0.08){c.fillStyle = '#3a1712';c.beginPath();c.ellipse(0.24*s, 0.27*s, 0.07*s, 0.025*s+mouth*0.05*s, 0, 0, TAU);c.fill();}
  else{c.strokeStyle = 'rgba(90,40,30,0.85)';c.lineWidth = 0.02*s;c.beginPath();c.moveTo(0.17*s, 0.26*s);c.quadraticCurveTo(0.24*s, 0.285*s, 0.31*s, 0.255*s);c.stroke();}
  c.restore();}
