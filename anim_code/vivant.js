// Animation « vivante » : gestes calés sur les mots (anticipation + rebond), respiration, transfert de poids, coups d'œil,
// réactions de celui qui écoute, oreilles qui suivent le mouvement, formes de bouche, marche, et découpage en plans.
// S'utilise par-dessus les poses des scènes : P = vivant(P, t, { parle: [ids], ecoute: [ids], vers: x, main: 'R'|'L', phase }).
const _h = (k) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function _mots(id) { return (typeof MOTS !== 'undefined' && MOTS[id]) || []; }
// impulsion d'un geste : petite anticipation en sens inverse, pic, puis rebond amorti
function pulse(dt) {
  if (dt < -.14 || dt > 1.1) return 0;
  if (dt < 0) return -.35 * Math.sin((dt + .14) / .14 * Math.PI);
  return Math.exp(-5.5 * dt) * Math.sin(dt * 13 + .2) * 1.15;
}
// les « temps forts » d'une réplique : mots longs ou ponctués, et le premier mot
function tempsForts(id) {
  const mots = _mots(id); if (!mots.length) return [];
  const r = [mots[0][1]];
  mots.forEach(([w, a], k) => { const n = w.replace(/[^\p{L}]/gu, '').length; if (k && (n >= 6 || /[!?]/.test(w)) && a - r[r.length - 1] > .45) r.push(a); });
  return r;
}
function battement(ids, t) { let s = 0; for (const id of ids) { const l = L[id]; if (!l) continue; for (const a of tempsForts(id)) s += pulse(t - l[0] - a); } return Math.max(-.4, Math.min(1.2, s)); }
// forme de bouche d'après la lettre prononcée
function viseme(ids, t) {
  for (const id of ids) { const l = L[id]; if (!l) continue; const tt = t - l[0]; if (tt < 0 || tt > l[1]) continue;
    for (const [w, a, b] of _mots(id)) { if (tt < a || tt > b) continue; const s = w.toLowerCase().normalize('NFD').replace(/[^a-z]/g, ''); if (!s) return ''; const ch = s[Math.min(s.length - 1, Math.floor((tt - a) / Math.max(.05, b - a) * s.length))];
      if ('mbp'.includes(ch)) return 'm'; if ('ou'.includes(ch)) return 'o'; if ('ie'.includes(ch)) return 'i'; return ''; } }
  return '';
}
function parleQui(ids, t) { return ids.some(id => L[id] && t >= L[id][0] && t <= L[id][0] + L[id][1]); }
// vivant : modifie la pose P en place (et la renvoie)
function vivant(P, t, o = {}) {
  const ph = o.phase || 0, parle = parleQui(o.parle || [], t), ecoute = parleQui(o.ecoute || [], t), tq = step(t);
  // respiration et transfert de poids (toujours)
  P.souffle = .007 * Math.sin(t * 2.3 + ph);
  P.sway = (P.walk ? 0 : 4 * Math.sin(t * .55 + ph));
  P.lean = (P.lean || 0) + (P.walk ? .035 : .012 * Math.sin(t * .55 + ph + .5));
  // clignements irréguliers
  const cyc = 2.6 + _h(Math.floor(t / 3 + ph)) * 2.4; P.blink = (t + ph * 3) % cyc < .11 ? 1 : 0;
  // coups d'œil quand on se tait
  if (!parle && !P.walk) { const g = Math.floor((t + ph * 5) / 2.7); if (_h(g + ph) > .55 && ((t + ph * 5) % 2.7) < .5) P.look = [(_h(g * 3) - .5) * 1.4, (_h(g * 7) - .6) * .6]; }
  if (parle) {
    const b = battement(o.parle, t), cote = o.main || 'R', h = cote === 'R' ? 'handR' : 'handL', sgn = cote === 'R' ? 1 : -1;
    const base = P[h] || (cote === 'R' ? [104, -440] : [-104, -440]);
    const repos = Math.abs(base[1] + 440) < 30 || Math.abs(base[1] + 366) < 30;
    if (repos && o.geste !== false) { P[h] = [base[0] + sgn * 50, base[1] - 150 - b * 55]; P['pose' + cote] = b > .5 ? 'ouverte' : (P['pose' + cote] && P['pose' + cote] !== 'repos' ? P['pose' + cote] : 'ouverte'); }
    else P[h] = [base[0] + sgn * b * 10, base[1] - b * 34];
    P.tilt = (P.tilt || 0) + b * .05 + Math.sin(t * 3.1 + ph) * .02;
    P.sourcil = Math.max(P.sourcil || 0, Math.max(0, b) * .9);
    P.bob = (P.bob || 0) + Math.max(0, b) * 5;
    P.viseme = viseme(o.parle, t);
    if (o.vers != null) P.look = [Math.sign(o.vers - P.x) * .8 * (P.face || 1), P.look ? P.look[1] : 0];
  }
  if (ecoute) {                                                  // il écoute : hoche la tête sur les temps forts de l'autre, sourcils qui réagissent
    const b = battement(o.ecoute, t - .18);
    P.tilt = (P.tilt || 0) + Math.max(0, b) * .06; P.sourcil = Math.max(P.sourcil || 0, Math.max(0, b) * .6);
    if (o.vers != null) P.look = [Math.sign(o.vers - P.x) * .9 * (P.face || 1), .1];
  }
  // les oreilles suivent le mouvement de la tête avec retard
  P.oreille = (P.oreille || 0) + (Math.sin((t - .12) * 3.1 + ph) - Math.sin(t * 3.1 + ph)) * .35 + (parle ? battement(o.parle, t - .1) * .08 : 0);
  // marche : balancier des bras opposé aux jambes, buste qui monte deux fois par pas
  if (P.walk && o.bras !== false) { const w = P.walk; P.handL = [-104 - 26 * Math.sin(w), (P.handL ? P.handL[1] : -440) - 20 * Math.abs(Math.cos(w))]; P.handR = [104 + 26 * Math.sin(w), (P.handR ? P.handR[1] : -440) - 20 * Math.abs(Math.cos(w))]; P.bob = Math.abs(Math.sin(w)) * 9; P.tilt = (P.tilt || 0) + Math.sin(w) * .03; }
  return P;
}
// dessine un personnage avec respiration et transfert de poids
function dessineVivant(c, P, f) { if (typeof STYLE_TRACE !== 'undefined' && STYLE_TRACE) return dessinTrace(c, P, f); c.save(); c.translate(P.sway || 0, -(P.bob || 0)); c.translate(P.x, P.y); c.scale(1, 1 + (P.souffle || 0)); c.translate(-P.x, -P.y); f(c, P); c.restore(); }
// découpage en plans : liste [début, cx, cy, zoom] ; coupe franche entre deux plans (deux images de fondu)
function plans(c, t, liste) {
  let k = liste[0]; for (const p of liste) if (t >= p[0]) k = p;
  const [, cx0, cy0, z0] = k; let z = Math.max(1, z0), cx = clamp(cx0, W / (2 * z), W - W / (2 * z)), cy = clamp(cy0, H / (2 * z), H - H / (2 * z));
  const dz = (t - k[0]) * .012; z += dz;                         // très léger travelling avant pendant le plan
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
}
// plans automatiques d'un dialogue : plan d'ensemble, gros plan sur celui qui parle, plan de réaction pour les longues répliques
function plansDialogue(lignes, pos, large = [540, 405, 1.12]) {
  const res = [[0, ...large]];
  lignes.forEach((id) => { const l = L[id]; if (!l) return; const who = l[2], autre = who === 'renard' ? 'mouton' : 'renard', [x, y] = pos[who] || [540, 400];
    res.push([l[0] - .15, x, y, 1.75]);
    if (l[1] > 2.4 && pos[autre]) { res.push([l[0] + l[1] * .55, pos[autre][0], pos[autre][1], 1.75]); res.push([l[0] + l[1] * .55 + .9, x, y, 1.6]); } });
  return res;
}

// rendu « dessin » : le personnage est peint à part, puis entouré d'un seul contour qui « vibre » légèrement, comme tracé à la main
let _trCv = null, _trC = null;
function dessinTrace(c, P, f, couleur = INK) {
  if (!_trCv) { _trCv = document.createElement('canvas'); _trCv.width = c.canvas.width; _trCv.height = c.canvas.height; _trC = _trCv.getContext('2d'); }
  const m = c.getTransform(); _trC.setTransform(1, 0, 0, 1, 0, 0); _trC.clearRect(0, 0, _trCv.width, _trCv.height); _trC.setTransform(m);
  _trC.save(); _trC.translate(P.sway || 0, -(P.bob || 0)); _trC.translate(P.x, P.y); _trC.scale(1, 1 + (P.souffle || 0)); _trC.translate(-P.x, -P.y);
  STYLE_DESSIN = true; try { f(_trC, P); } finally { STYLE_DESSIN = false; } _trC.restore();
  const fr = Math.floor((P.t || 0) * 15), z = Math.hypot(m.a, m.b), d = Math.max(1.2, 2.3 * z * (P.s || .6) / .6) + (hash(fr) - .5) * .5, j = (hash(fr + 7) - .5) * .6;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.filter = `drop-shadow(${d + j}px 0 0 ${couleur}) drop-shadow(${-d}px ${j}px 0 ${couleur}) drop-shadow(0 ${d}px 0 ${couleur}) drop-shadow(${j}px ${-d}px 0 ${couleur})`;
  c.drawImage(_trCv, 0, 0); c.filter = 'none'; c.drawImage(_trCv, 0, 0); c.restore();
}
