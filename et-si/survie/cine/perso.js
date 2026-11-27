/* ET SI ? — personnage v2 : squelette à longueurs fixes (bras en cinématique inverse), mains simples,
   têtes au choix (STYLE_TETE : 'A' semi-réaliste doux, 'B' dessin animé, 'C' minimal sans traits).
   figure(c, x, y, u, pose, col) : x,y = base du cou ; u = taille d'une tête ; personnage de 3/4 vers la droite.
   pose = {lean, look (-1..1), ex:{eye, brow, mouth}, near:{to:[x,y] | rest, hand:'grip'|'open'|'rest'|'point', ang, bend},
           far:{...}, held:fn(c) (objet tenu, dessiné entre le corps et le bras avant)} */
let STYLE_TETE = 'B';
// angle par défaut du personnage : 0 = trois-quarts, 1 = de face (pose.turn le remplace)
let TOURNE = 0;
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
// segment effilé (largeur w1 -> w2) avec extrémités arrondies
function taper(c, A, B, w1, w2){const a = Math.atan2(B[1]-A[1], B[0]-A[0]), nx = -Math.sin(a), ny = Math.cos(a);c.beginPath();
  c.moveTo(A[0]+nx*w1/2, A[1]+ny*w1/2);c.lineTo(B[0]+nx*w2/2, B[1]+ny*w2/2);c.arc(B[0], B[1], w2/2, a+Math.PI/2, a-Math.PI/2, true);c.lineTo(A[0]-nx*w1/2, A[1]-ny*w1/2);c.arc(A[0], A[1], w1/2, a-Math.PI/2, a+Math.PI/2, true);c.closePath();c.fill();}
function limbDraw(c, S, E, W, u, col, front, hand, hang){const k = front ? 1 : 0.8;
  // avant-bras (poignet plus fin), bras, puis manche courte en forme d'épaule
  const sk = (m) => rgb(col.skin, m*k);
  c.fillStyle = sk(0.96);taper(c, E, W, 0.3*u, 0.23*u);
  c.fillStyle = sk(0.98);taper(c, S, E, 0.36*u, 0.3*u);
  const M = [lerp(S[0], E[0], 0.52), lerp(S[1], E[1], 0.52)];const fa = Math.atan2(E[1]-S[1], E[0]-S[0]);
  c.fillStyle = lg(c, S[0]-Math.sin(fa)*0.25*u, S[1]+Math.cos(fa)*0.25*u, S[0]+Math.sin(fa)*0.25*u, S[1]-Math.cos(fa)*0.25*u, [[0, rgb(col.shirtD, 0.95*k)], [0.55, rgb(col.shirt, 1.04*k)], [1, rgb(col.shirt, 0.92*k)]]);
  taper(c, S, M, 0.44*u, 0.4*u);
  c.strokeStyle = rgb(col.shirtD, 0.8*k);c.lineWidth = 0.035*u;c.lineCap = 'round';c.beginPath();c.moveTo(M[0]+Math.cos(fa+1.57)*0.2*u, M[1]+Math.sin(fa+1.57)*0.2*u);c.lineTo(M[0]-Math.cos(fa+1.57)*0.2*u, M[1]-Math.sin(fa+1.57)*0.2*u);c.stroke();
  mitt(c, W[0], W[1], hang, u, hand, front ? col : {...col, skin:col.skin.map(v=>v*0.85), skinD:col.skinD});}
// coude naturel : il pointe vers le bas et vers l'arrière (trois-quarts), vers le bas et l'extérieur (de face)
function armOf(c, S, A, u, col, front, defAng, turn = 0){if(!A)return null;let W0;
  if(A.to)W0 = A.to; else W0 = [S[0]+lerp(front?0.3:0.05, front?0.12:-0.12, turn)*u, S[1]+2.05*u];
  let bend = A.bend ?? 1;
  if(!A.garderCoude){const mx = (S[0]+W0[0])/2, my = (S[1]+W0[1])/2, side = front ? 1 : -1;
    const sc = b => {const E = ik(S, W0, ARM_A*u, ARM_B*u, b).E;return (E[1]-my) + (turn > 0.5 ? side*(E[0]-mx)*0.9 : (mx-E[0])*0.8);};
    bend = sc(1) >= sc(-1) ? 1 : -1;}
  const r = ik(S, W0, ARM_A*u, ARM_B*u, bend);const hang = A.ang ?? r.fa;return {S, ...r, hand:A.hand||'rest', hang};}
// vie au repos : respiration, petits mouvements de tête, clignements (déterministe, propre à chaque personnage)
function vie(x, u, col){const t = (typeof TNOW !== 'undefined' ? TNOW : 0), sd = (col.skin[0]*7 + col.shirt[1]*3) % 97 / 97;
  const br = Math.sin(t*2*Math.PI/3.6 + sd*6);const per = 3.2 + sd*1.6, ph = ((t + sd*per) % per);const blink = ph < 0.12 ? 1 - Math.abs(ph - 0.06)/0.06 : 0;
  return {br, blink, nod: Math.sin(t*0.9 + sd*5)*0.025 + Math.sin(t*2.3 + sd*3)*0.01};}
function figure(c, x, y, u, p = {}, col = MAN){const V = p.calme === false ? {br:0, blink:0, nod:0} : vie(x, u, col);y += V.br*0.025*u;const lean = (p.lean||0) + V.br*0.006;c.save();
  // repère du corps (rotation autour du bassin)
  const piv = [x, y+2.6*u];const rot = (q)=>{const dx = q[0]-piv[0], dy = q[1]-piv[1], cs = Math.cos(lean), sn = Math.sin(lean);return [piv[0]+dx*cs-dy*sn, piv[1]+dx*sn+dy*cs];};
  const nk = rot([x, y]), T0 = clamp(p.turn ?? TOURNE), sN = rot([x+lerp(0.4, 0.62, T0)*u, y+lerp(0.4, 0.36, T0)*u]), sF = rot([x-lerp(0.3, 0.62, T0)*u, y+lerp(0.34, 0.36, T0)*u]);
  // de face, les coudes plient vers l'extérieur (sinon les bras se croisent)
  const far = armOf(c, sF, p.far === undefined ? {} : p.far, u, col, false, 0, T0), near = armOf(c, sN, p.near === undefined ? {} : p.near, u, col, true, 0, T0);
  const farFront = p.farFront || T0 > 0.5;
  if(far && !p.defer && !farFront)limbDraw(c, far.S, far.E, far.W, u, col, false, far.hand, far.hang);
  if(p.legs){c.save();const ly = y+3.25*u, L = p.legLen ?? 3.1*u;
    c.fillStyle = rgb(col.pants || [44, 50, 62], 0.85);c.beginPath();c.roundRect(x-0.5*u, ly-0.2*u, 0.5*u, L, 0.18*u);c.fill();
    c.fillStyle = rgb(col.pants || [44, 50, 62], 1);c.beginPath();c.roundRect(x+0.02*u, ly-0.2*u, 0.52*u, L, 0.18*u);c.fill();
    c.fillStyle = '#16181c';c.beginPath();c.roundRect(x-0.52*u, ly+L-0.25*u, 0.66*u, 0.28*u, 0.12*u);c.roundRect(x+0.0*u, ly+L-0.25*u, 0.72*u, 0.3*u, 0.12*u);c.fill();c.restore();}
  // torse
  c.save();c.translate(piv[0], piv[1]);c.rotate(lean);c.translate(-piv[0], -piv[1]);
  c.fillStyle = T0 > 0.5 ? lg(c, x-0.85*u, 0, x+0.85*u, 0, [[0, rgb(col.shirtD, 0.95)], [0.5, rgb(col.shirt, 1.06)], [1, rgb(col.shirtD, 0.95)]]) : lg(c, x-0.8*u, 0, x+0.8*u, 0, [[0, rgb(col.shirtD, 0.95)], [0.45, rgb(col.shirt, 1.0)], [1, rgb(col.shirt, 1.1)]]);
  const Q = (a3, f) => lerp(a3, f, T0);c.beginPath();c.moveTo(x-0.22*u, y);
  c.bezierCurveTo(x-Q(0.5, 0.6)*u, y+0.04*u, x-Q(0.66, 0.82)*u, y+Q(0.16, 0.12)*u, x-Q(0.68, 0.82)*u, y+Q(0.55, 0.48)*u);c.bezierCurveTo(x-Q(0.7, 0.82)*u, y+1.1*u, x-Q(0.56, 0.6)*u, y+1.7*u, x-Q(0.54, 0.58)*u, y+2.3*u);
  c.lineTo(x-Q(0.56, 0.6)*u, y+3.4*u);c.lineTo(x+Q(0.6, 0.64)*u, y+3.4*u);c.lineTo(x+Q(0.6, 0.62)*u, y+2.3*u);
  c.bezierCurveTo(x+Q(0.66, 0.64)*u, y+1.7*u, x+Q(0.8, 0.88)*u, y+1.15*u, x+Q(0.74, 0.86)*u, y+Q(0.6, 0.48)*u);c.bezierCurveTo(x+Q(0.7, 0.86)*u, y+Q(0.2, 0.12)*u, x+Q(0.5, 0.62)*u, y+0.04*u, x+0.24*u, y);c.closePath();c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.14)';c.lineWidth = 0.05*u;c.lineCap = 'round';c.beginPath();c.moveTo(x-0.3*u, y+1.2*u);c.quadraticCurveTo(x-0.1*u, y+1.6*u, x-0.32*u, y+2.1*u);c.stroke();
  // cou + col
  c.fillStyle = rgb(col.skinD, 1.05);c.beginPath();c.roundRect(x-0.16*u, y-0.28*u, 0.34*u, 0.38*u, 0.1*u);c.fill();
  c.fillStyle = rgb(col.shirtD, 0.8);c.beginPath();c.ellipse(x+0.02*u, y+0.02*u, 0.24*u, 0.08*u, 0, 0, Math.PI);c.fill();
  c.restore();
  const hc = rot([x+lerp(0.04, 0.01, clamp(p.turn ?? TOURNE))*u+(p.headDX||0)*u, y-0.72*u]);const ex0 = p.ex||{};const exB = V.blink ? {...ex0, eye: Math.min(ex0.eye ?? 0.6, 0.6*(1-V.blink))} : ex0;head2(c, hc[0], hc[1]-V.br*0.012*u, u, exB, p.look??0.6, col, (p.tilt||0) + V.nod, p.turn ?? TOURNE);
  if(far && !p.defer && farFront)limbDraw(c, far.S, far.E, far.W, u, col, false, far.hand, far.hang);
  if(p.held)p.held(c);
  if(near && !p.defer)limbDraw(c, near.S, near.E, near.W, u, col, true, near.hand, near.hang);
  c.restore();return {near, far, rot, u, col};}
// bras différés (p.defer) : à dessiner après un autre personnage, par ex. bras autour de la victime
function drawArm(c, A, u, col, front = true){if(A)limbDraw(c, A.S, A.E, A.W, u, col, front, A.hand, A.hang);}
// tête : centre (x,y) ; u = hauteur de tête
function head2(c, x, y, u, ex, look, col, tilt, turn = 0){const eye = ex.eye ?? 0.6, brow = ex.brow ?? 0, mouth = ex.mouth ?? 0, st = STYLE_TETE;
  // turn : 0 = trois-quarts (regard vers la droite), 1 = de face
  c.save();c.translate(x, y);c.rotate(tilt);const s = u*(col.headScale||1.3);const T = clamp(turn), L = (a, b) => lerp(a, b, T);
  const fx = L(0.06, 0), cx = L(0.24, 0);   // centre du visage, axe des traits
  // oreilles (une seule de trois-quarts, deux de face)
  const ear = (ox, a) => {if(a <= 0)return;c.globalAlpha = a;c.fillStyle = rgb(col.skin, 0.92);c.beginPath();c.ellipse(ox*s, 0.03*s, 0.07*s, 0.1*s, 0.1, 0, TAU);c.fill();c.fillStyle = rgb(col.skinD, 0.9);c.beginPath();c.ellipse(ox*s, 0.03*s, 0.035*s, 0.06*s, 0.1, 0, TAU);c.fill();c.globalAlpha = 1;};
  ear(L(-0.2, -0.34), 1);ear(0.38, seg(T, 0.6, 1));
  if(col.longHair){c.fillStyle = col.hair;c.beginPath();c.ellipse(L(-0.08, 0)*s, L(0.1, -0.04)*s, L(0.36, 0.44)*s, L(0.48, 0.42)*s, L(0.15, 0), 0, TAU);c.fill();
    if(T > 0.3){c.globalAlpha = seg(T, 0.3, 0.8);for(const sx of [-1, 1]){c.beginPath();c.roundRect(sx*0.3*s-0.09*s, -0.1*s, 0.18*s, 0.62*s, 0.09*s);c.fill();}c.globalAlpha = 1;}}
  // visage
  const face = new Path2D();face.ellipse(fx*s, 0, L(0.34, 0.36)*s, 0.43*s, 0, 0, TAU);face.ellipse(L(0.16, 0)*s, 0.2*s, L(0.22, 0.27)*s, 0.2*s, 0, 0, TAU);
  c.fillStyle = lg(c, -0.36*s, 0, 0.45*s, 0, [[0, rgb(col.skinD, L(1.08, 1.0))], [0.35, rgb(col.skin, 1.0)], [1, rgb(col.skin, 1.06)]]);c.fill(face);
  if(st === 'A'){c.save();c.clip(face);c.fillStyle = 'rgba(200,110,90,0.18)';c.beginPath();c.ellipse((cx+0.02)*s, 0.14*s, 0.09*s, 0.06*s, 0, 0, TAU);c.fill();
    if(col.beard){c.fillStyle = 'rgba(35,24,18,0.38)';c.beginPath();c.ellipse(L(0.18, 0)*s, 0.32*s, 0.26*s, 0.15*s, 0, 0, TAU);c.fill();}c.restore();}
  // cheveux : mèche de trois-quarts -> calotte symétrique de face
  c.fillStyle = col.hair;c.beginPath();c.moveTo(L(-0.26, -0.37)*s, 0.06*s);c.bezierCurveTo(L(-0.36, -0.44)*s, -0.4*s, L(0.1, -0.1)*s, -0.6*s, L(0.38, 0.1)*s, L(-0.24, -0.58)*s);
  if(T > 0.01){c.bezierCurveTo(L(0.38, 0.3)*s, L(-0.24, -0.56)*s, L(0.38, 0.46)*s, L(-0.24, -0.38)*s, L(0.38, 0.37)*s, L(-0.24, 0.06)*s);c.lineTo(L(0.38, 0.3)*s, L(-0.24, -0.14)*s);c.quadraticCurveTo(L(0.3, 0)*s, L(-0.26, -0.3)*s, L(0.12, -0.3)*s, L(-0.2, -0.14)*s);}
  else{c.bezierCurveTo(0.3*s, -0.26*s, 0.2*s, -0.24*s, 0.12*s, -0.2*s);}
  c.bezierCurveTo(L(0.0, -0.32)*s, L(-0.16, -0.08)*s, L(-0.12, -0.36)*s, L(-0.12, -0.04)*s, L(-0.16, -0.37)*s, L(0.04, 0.06)*s);c.closePath();c.fill();
  if(st === 'C'){c.restore();return;}
  // yeux
  const lk = look*0.03*s*(1-T*0.6), eh = (0.035+0.04*eye)*s;const eyeAt = (ex0, w)=>{if(eye < 0.15){c.strokeStyle = '#1b120c';c.lineWidth = 0.02*s;c.lineCap = 'round';c.beginPath();c.ellipse(ex0, -0.02*s, w, 0.02*s, 0, 0.1, Math.PI-0.1);c.stroke();return;}c.fillStyle = '#f4efe9';c.beginPath();c.ellipse(ex0, -0.02*s, w, eh, 0, 0, TAU);c.fill();
    c.fillStyle = st === 'B' ? '#1b120c' : col.eye;c.beginPath();c.arc(ex0+lk, -0.02*s, Math.min(w, eh)*0.85, 0, TAU);c.fill();
    if(st === 'A'){c.fillStyle = '#0b0705';c.beginPath();c.arc(ex0+lk, -0.02*s, Math.min(w, eh)*0.4, 0, TAU);c.fill();}
    c.fillStyle = 'rgba(255,255,255,0.9)';c.beginPath();c.arc(ex0+lk+0.012*s, -0.035*s, 0.012*s, 0, TAU);c.fill();
    c.strokeStyle = 'rgba(30,18,12,0.7)';c.lineWidth = 0.014*s;c.beginPath();c.ellipse(ex0, -0.02*s, w, eh, 0, Math.PI*1.1, Math.PI*1.9);c.stroke();};
  const e1 = L(0.13, -0.12), e2 = L(0.33, 0.12);eyeAt(e1*s, 0.055*s);eyeAt(e2*s, L(0.042, 0.055)*s);
  // sourcils
  c.strokeStyle = col.hair;c.lineCap = 'round';c.lineWidth = 0.032*s;const by = -0.12*s-brow*0.04*s;
  c.beginPath();c.moveTo((e1-0.06)*s, by+0.01*s);c.quadraticCurveTo(e1*s, by-0.03*s-brow*0.01*s, (e1+0.07)*s, by);c.stroke();c.beginPath();c.moveTo((e2-L(0.05, 0.07))*s, by);c.quadraticCurveTo(e2*s, by-0.03*s, (e2+0.06)*s, by+0.005*s);c.stroke();
  // nez : crochet de trois-quarts, petit nez central de face
  c.strokeStyle = rgb(col.skinD, 0.95);c.lineWidth = 0.02*s;c.beginPath();c.moveTo(L(0.3, 0.0)*s, 0.02*s);c.quadraticCurveTo(L(0.4, 0.05)*s, 0.12*s, L(0.31, -0.03)*s, 0.15*s);c.stroke();
  // bouche
  const mx = L(0.24, 0);
  if(mouth > 0.08){c.fillStyle = '#3a1712';c.beginPath();c.ellipse(mx*s, 0.27*s, L(0.07, 0.085)*s, 0.025*s+mouth*0.05*s, 0, 0, TAU);c.fill();}
  else{c.strokeStyle = 'rgba(90,40,30,0.85)';c.lineWidth = 0.02*s;c.beginPath();c.moveTo((mx-0.075)*s, 0.26*s);c.quadraticCurveTo(mx*s, 0.29*s, (mx+0.075)*s, 0.26*s);c.stroke();}
  c.restore();}
