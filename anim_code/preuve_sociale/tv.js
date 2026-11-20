// Monde du téléviseur (N&B années 30) : la chapellerie d'une ville imaginaire, le marchand, les passants, la file.
// (chaque scène définit sa propre DUREE)
let _chapNB = null;
function chapeauNB(c, x, y, s, k = 0, rot = 0) {             // chapeaux de la vitrine (gris), k = modèle
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  if (k === 0) { chapeauMode(c, 0, 0, 1); c.restore(); return; }
  const col = [GRIS.noir, GRIS.clair, GRIS.fonce, GRIS.blanc][k % 4];
  F(c, ell(0, 0, 80, 16), col, 4);
  const cou = k % 2 ? smooth([[-48, -4], [-44, -70], [0, -84], [44, -70], [48, -4]]) : poly([[-46, -4], [46, -4], [42, -90], [-42, -90]]);
  F(c, cou, col, 4); ombre(c, cou, -48, 0, 48, 0, .3); F(c, poly([[-48, -14], [48, -14], [47, -30], [-47, -30]]), k % 2 ? GRIS.noir : GRIS.blanc, 2.5);
  c.restore();
}
function presentoir(c, x, y, s) {                            // présentoir à pied tourné
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, ell(0, 0, 44, 10), GRIS.fonce, 3); F(c, smooth([[-10, 0], [-6, -40], [-14, -60], [-6, -80], [-8, -120], [8, -120], [6, -80], [14, -60], [6, -40], [10, 0]]), GRIS.moyen, 3);
  F(c, ell(0, -122, 30, 8), GRIS.fonce, 3); c.restore();
}
function fondChapellerieNB() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const ciel = c.createLinearGradient(0, 0, 0, 200); ciel.addColorStop(0, '#e4e2dc'); ciel.addColorStop(1, '#f6f4ee'); c.fillStyle = ciel; c.fillRect(0, 0, W, H);
  // façades voisines en briques
  for (const [x0, x1, col] of [[-10, 250, '#c4c0b6'], [830, 1090, '#d0ccc2']]) {
    const fa = poly([[x0, 500], [x1, 500], [x1, 0], [x0, 0]]); F(c, fa, col, 4); ombre(c, fa, x0, 0, x1, 0, .25);
    for (let y = 10, r = 0; y < 500; y += 16, r++) { ink(c, 1, 'rgba(0,0,0,.16)'); c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); for (let x = x0 + (r % 2) * 18; x < x1; x += 36) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 16); c.stroke(); } }
    for (let r = 0; r < 2; r++) for (let q = 0; q < 2; q++) { const wx = x0 + 40 + q * 110, wy = 50 + r * 150;
      F(c, poly([[wx - 8, wy - 10], [wx + 78, wy - 10], [wx + 72, wy - 22], [wx - 2, wy - 22]]), GRIS.fonce, 2);
      F(c, poly([[wx, wy], [wx + 70, wy], [wx + 70, wy + 100], [wx, wy + 100]]), GRIS.blanc, 3); ink(c, 3); c.beginPath(); c.moveTo(wx + 35, wy); c.lineTo(wx + 35, wy + 100); c.moveTo(wx, wy + 40); c.lineTo(wx + 70, wy + 40); c.stroke();
      F(c, smooth([[wx + 2, wy + 2], [wx + 30, wy + 2], [wx + 12, wy + 60], [wx + 2, wy + 96]]), GRIS.clair, 1.5);                       // rideau
      F(c, poly([[wx - 6, wy + 100], [wx + 76, wy + 100], [wx + 76, wy + 110], [wx - 6, wy + 110]]), GRIS.fonce, 2);
      if ((r + q) % 2 === 0) for (let f = 0; f < 5; f++) F(c, ell(wx + 6 + f * 14, wy + 96, 7, 7), GRIS.moyen, 1.2); }
    F(c, poly([[x0 + 30, 500], [x1 - 30, 500], [x1 - 30, 380], [x0 + 30, 380]]), GRIS.fonce, 3);
    F(c, poly([[x0 + 44, 492], [x1 - 44, 492], [x1 - 44, 394], [x0 + 44, 394]]), '#e8e6e0', 2); ink(c, 2); c.beginPath(); c.moveTo((x0 + x1) / 2, 394); c.lineTo((x0 + x1) / 2, 492); c.stroke();
  }
  // la chapellerie : façade en bois mouluré
  const fx0 = 250, fx1 = 830;
  F(c, poly([[fx0, 500], [fx1, 500], [fx1, 30], [fx0, 30]]), '#8a867c', 5);
  F(c, poly([[fx0 - 14, 30], [fx1 + 14, 30], [fx1 + 6, 0], [fx0 - 6, 0]]), GRIS.fonce, 4);
  for (let k = 0; k < 14; k++) F(c, poly([[fx0 + k * 42, 30], [fx0 + 30 + k * 42, 30], [fx0 + 26 + k * 42, 42], [fx0 + 4 + k * 42, 42]]), GRIS.moyen, 1.5);   // denticules
  // enseigne
  F(c, poly([[fx0 + 40, 56], [fx1 - 40, 56], [fx1 - 40, 120], [fx0 + 40, 120]]), GRIS.noir, 4); ink(c, 3, GRIS.clair); c.strokeRect(fx0 + 50, 64, fx1 - fx0 - 100, 48);
  c.save(); c.font = 'bold 38px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('MODES & CHAPEAUX', (fx0 + fx1) / 2, 102); c.restore();
  for (const sd of [-1, 1]) { const ex = (fx0 + fx1) / 2 + sd * 270; F(c, ell(ex, 88, 12, 12), GRIS.clair, 2); }
  // auvent rayé festonné
  for (let k = 0; k < 13; k++) { const ax = fx0 + 10 + k * 43.5; F(c, poly([[ax, 132], [ax + 43.5, 132], [ax + 50, 176], [ax + 6, 176]]), k % 2 ? GRIS.blanc : GRIS.fonce, 2); F(c, smooth([[ax + 6, 176], [ax + 50, 176], [ax + 28, 192]]), k % 2 ? GRIS.blanc : GRIS.fonce, 1.5); }
  // vitrine
  const vx0 = fx0 + 30, vx1 = fx1 - 150, vy0 = 200, vy1 = 452;
  const vit = poly([[vx0, vy1], [vx1, vy1], [vx1, vy0], [vx0, vy0]]); F(c, vit, '#3a3834', 5);
  const fondV = c.createLinearGradient(0, vy0, 0, vy1); fondV.addColorStop(0, '#5a5650'); fondV.addColorStop(1, '#2a2826'); c.fillStyle = fondV; c.fill(vit);
  F(c, smooth([[vx0 + 4, vy0 + 4], [vx0 + 60, vy0 + 4], [vx0 + 40, vy0 + 120], [vx0 + 50, vy1 - 4], [vx0 + 4, vy1 - 4]]), GRIS.clair, 2);    // drapé
  F(c, smooth([[vx1 - 4, vy0 + 4], [vx1 - 60, vy0 + 4], [vx1 - 40, vy0 + 120], [vx1 - 50, vy1 - 4], [vx1 - 4, vy1 - 4]]), GRIS.clair, 2);
  F(c, poly([[vx0 + 6, vy1 - 30], [vx1 - 6, vy1 - 30], [vx1 - 6, vy1 - 4], [vx0 + 6, vy1 - 4]]), GRIS.moyen, 2);                             // gradin
  presentoir(c, vx0 + 90, vy1 - 30, .8); chapeauNB(c, vx0 + 90, vy1 - 30 - 100, .5, 1);
  presentoir(c, vx1 - 90, vy1 - 30, .8); chapeauNB(c, vx1 - 90, vy1 - 30 - 100, .5, 2);
  for (let k = 0; k < 4; k++) { const bx = vx0 + 150 + k * 22; F(c, ell(bx, vy1 - 40, 9, 3), GRIS.clair, 1); }
  ink(c, 6, GRIS.noir); c.strokeRect(vx0, vy0, vx1 - vx0, vy1 - vy0); ink(c, 3, GRIS.clair); c.strokeRect(vx0 + 8, vy0 + 8, vx1 - vx0 - 16, vy1 - vy0 - 16);
  c.save(); c.font = 'italic 18px Georgia'; c.textAlign = 'center'; c.fillStyle = 'rgba(255,255,255,.75)'; c.fillText('Maison fondée en 1902', (vx0 + vx1) / 2, vy0 + 30); c.restore();
  // porte vitrée
  const px0 = fx1 - 130, px1 = fx1 - 30; F(c, poly([[px0, 500], [px1, 500], [px1, 210], [px0, 210]]), GRIS.fonce, 4); F(c, poly([[px0 + 12, 480], [px1 - 12, 480], [px1 - 12, 224], [px0 + 12, 224]]), '#4a4844', 2.5);
  F(c, ell(px1 - 22, 360, 5, 5), GRIS.blanc, 2); c.save(); c.font = 'bold 14px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('OUVERT', (px0 + px1) / 2, 260); c.restore();
  // soubassement + trottoir + pavés
  F(c, poly([[fx0, 452], [fx1, 452], [fx1, 500], [fx0, 500]]), GRIS.fonce, 4);
  for (let x = fx0 + 20; x < fx1 - 150; x += 80) { ink(c, 2, GRIS.moyen); c.strokeRect(x, 462, 60, 28); }
  F(c, poly([[0, 500], [W, 500], [W, 560], [0, 560]]), '#bcb8ae', 3);
  for (let x = 0; x < W; x += 90) { ink(c, 1.5, 'rgba(0,0,0,.25)'); c.beginPath(); c.moveTo(x, 500); c.lineTo(x - 10, 560); c.stroke(); }
  F(c, poly([[0, 560], [W, 560], [W, 574], [0, 574]]), GRIS.moyen, 2.5);
  c.fillStyle = '#8e8a80'; c.fillRect(0, 574, W, H - 574);
  for (let y = 582; y < H; y += 24) for (let x = ((y / 24) % 2) * 22; x < W + 22; x += 44) { const p = ell(x, y, 20, 10); F(c, p, '#a29e94', 1.5); reflet(c, p, x - 6, y - 3, 7, 3, .35, 0); }
  // réverbère
  const lx = 990; ink(c, 10); c.beginPath(); c.moveTo(lx, 720); c.lineTo(lx, 240); c.stroke(); F(c, poly([[lx - 16, 720], [lx + 16, 720], [lx + 9, 680], [lx - 9, 680]]), GRIS.noir, 2);
  F(c, poly([[lx - 22, 240], [lx + 22, 240], [lx + 14, 190], [lx - 14, 190]]), GRIS.blanc, 3); F(c, poly([[lx - 26, 190], [lx + 26, 190], [lx, 170]]), GRIS.noir, 2);
  return cv;
}
// chapellerieNB(c, t, o) : o.panneau 0..1 (étiquette « LE CHAPEAU DE L'ANNÉE »), o.vedette (chapeau sur le présentoir central), o.spot
const PRES = [600, 616];                                       // le présentoir sur le trottoir, devant la vitrine
function chapellerieNB(c, t, o = {}) {
  if (!_chapNB) _chapNB = fondChapellerieNB(); c.drawImage(_chapNB, 0, 0);
  const [px, py] = PRES;
  if (o.panneau > 0) {                                                 // le marchand accroche l'étiquette au-dessus du présentoir
    const k = ease(o.panneau), yy = lerp(200, 262, k); ink(c, 2.5, GRIS.noir); c.beginPath(); c.moveTo(px - 40, 196); c.lineTo(px - 40, yy); c.moveTo(px + 40, 196); c.lineTo(px + 40, yy); c.stroke();
    c.save(); c.translate(px, yy + 26); c.rotate(wob(t, .6, .05 * (1 - k) + .012));
    F(c, poly([[-96, -26], [96, -26], [96, 26], [-96, 26]]), GRIS.blanc, 4); ink(c, 2); c.strokeRect(-88, -19, 176, 38);
    c.font = 'bold 17px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LE CHAPEAU', 0, -2); c.fillText("DE L'ANNÉE !", 0, 17);
    if (k > .9) for (const sd of [-1, 1]) etoile(c, sd * 114, 0, 12);
    c.restore();
  }
  F(c, ell(px, py + 4, 60, 12), 'rgba(0,0,0,.25)', 0);
  presentoir(c, px, py, 1.1);
  if (o.vedette !== false) chapeauNB(c, px, py - 136, .58, 0, wob(step(t), .3, .02));
  if (o.spot) { const g = c.createRadialGradient(px, py - 160, 10, px, py - 100, 220); g.addColorStop(0, `rgba(255,255,255,${.4 * o.spot})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(px - 240, py - 360, 480, 420); }
}
function plumeau(c, x, y, a) {                               // plumeau du marchand
  c.save(); c.translate(x, y); c.rotate(a);
  F(c, poly([[-3, 0], [3, 0], [3, -60], [-3, -60]]), GRIS.fonce, 2);
  for (let k = 0; k < 9; k++) { const b = -1 + k * .25; F(c, smooth([[0, -58], [Math.sin(b) * 22, -70 - Math.cos(b) * 14], [Math.sin(b) * 34, -86 - Math.cos(b) * 24], [Math.sin(b) * 14, -76]]), k % 2 ? GRIS.noir : GRIS.fonce, 1.2); }
  c.restore();
}
// un passant de la file : variante v, position x ; renvoie P prêt à dessiner
function passant(t, x, v, o = {}) {
  const tq = step(t);
  return Object.assign({ x, y: 640, s: .4, t: tq, v, face: -1, look: [-.6, -.1], blink: ((t + v * .7) % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .4, .03, v), bob: bnc(tq, v * .3) * 2,
    handL: [-80, -420], handR: [80, -420] }, o);
}
function marchandBase(t, x = 560) { const tq = step(t); return { x, y: 660, s: .44, t: tq, look: [.6, 0], blink: (t % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .5, .04), bob: bnc(tq, .5) * 3 }; }
function dessine(c, P, f) { if (P.souffle != null) { dessineVivant(c, P, f || drawFigurant); return; } c.save(); c.translate(0, -(P.bob || 0)); (f || drawFigurant)(c, P); c.restore(); }
function debutFlash(c, t) { if (t < .35) { c.fillStyle = `rgba(255,255,255,${1 - ease(t / .35)})`; c.fillRect(0, 0, W, H); } }
// la file devant la vitrine : n passants (fractionnaire = le dernier arrive en marchant)
function file(c, t, n, o = {}) {
  const X0 = o.x0 || 500, dx = o.dx || -74, dir = dx < 0 ? -1 : 1, arr = [];
  for (let k = Math.ceil(n) - 1; k >= 0; k--) {
    const u = Math.min(1, n - k), x = X0 + k * dx + dir * (1 - ease(u)) * 700;
    const P = passant(t, x, k + (o.v0 || 0), { face: -dir, look: [-dir * .6, -.1] });
    if (u < 1) { P.walk = t * 9 + k; P.bob = Math.abs(Math.sin(t * 9 + k)) * 6; }
    else if (o.regarde) { P.look = [hash(k * 3 + Math.floor(t * .8)) > .5 ? .8 : -.8, -.1]; P.tilt = wob(step(t), .8, .06, k); }
    if (o.chapeaux && k < o.chapeaux) P.chapeau = (cc, hy) => chapeauNB(cc, 0, hy - 64, .62, 0, -.06);
    if (o.modif) o.modif(P, k);
    arr.push(P); dessine(c, P, drawFigurant);
  }
  return arr;
}
