// SCÈNE 16 — Plans 26-29 (salon). s16a : il pose doucement le chapeau et sourit. s16b : le renard ouvre la main vers lui.
// s16c : il l'essaie avec assurance. s16d : « Un groupe peut inspirer. Il ne doit pas décider. » — la lumière de la télé s'éteint.
const A = L.s16a, B = L.s16b, C = L.s16c, Dd = L.s16d, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : Dd[0] + Dd[1] + 1.4);
const GUER = [580, 700];                                                   // petit guéridon
function gueridon(c) { const [x, y] = GUER; F(c, ell(x, y - 120, 70, 16), SALON_BOIS(), 4); F(c, ell(x, y - 126, 70, 16), '#9c5a2c', 4); F(c, poly([[x - 6, y - 116], [x + 6, y - 116], [x + 8, y - 8], [x - 8, y - 8]]), '#5a2e14', 3); for (const sd of [-1, 0, 1]) F(c, smooth([[x, y - 20], [x + sd * 40, y - 4], [x + sd * 46, y + 4]]), '#5a2e14', 3); }
function SALON_BOIS() { return '#7a4220'; }
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s16b', 's16d'], t), M = voix(moutonBase(t), ['s16a', 's16c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - Dd[0];
  R.x = 400; R.look = [.9, 0];
  M.x = 720; M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing'; M.look = [-.6, .2]; M.froncer = .3;
  let ch = 'mains';                                                         // mains | pose | tete
  if (la >= 0) { const k = ease(seg(la, .2, 1)); M.lean = -.08 * k * (lb < 0); M.handL = [lerp(-46, -150, k), lerp(-480, -420, k)]; M.handR = [lerp(46, -90, k), lerp(-480, -430, k)]; M.look = [-1, .6]; M.froncer = .2; M.sourire = .7;
    if (k >= 1) { ch = 'pose'; M.handL = [-104, -366]; M.handR = [104, -366]; M.poseL = M.poseR = 'repos'; M.lean = 0; M.look = [-.6, 0]; M.sourire = 1; } }
  if (lb >= 0) { const k = ease(seg(lb, 0, .5)); R.handR = [lerp(104, 300, k), lerp(-440, -560, k)]; R.poseR = 'ouverte'; R.lean = .04 * k; R.sourire = .9; R.lid = .55; M.look = [-.9, -.1]; }
  if (lc >= 0) { const k = ease(seg(lc, 0, .7)); ch = k < 1 ? 'monte' : 'tete'; R.handR = [104, -440]; R.poseR = 'repos'; R.lean = 0;
    M.handL = [lerp(-150, -60, k), lerp(-420, -840, k)]; M.handR = [lerp(-90, 60, k), lerp(-430, -840, k)]; M.poseL = M.poseR = 'poing'; M.look = [-.2, -.4];
    if (k >= 1) { M.handL = [-96, -470]; M.handR = [96, -470]; M.poseL = M.poseR = 'poing'; M.sourire = 1.2; M.froncer = 0; M.tilt = -.08; M.lean = -.04; M.look = [-.4, -.2]; M.chapeau = CHAP_TETE(-.12); } }   // avec assurance
  if (lc > C[1]) { M.chapeau = CHAP_TETE(-.12); ch = 'tete'; }
  if (ld >= 0) { R.handL = [-150, -700]; R.poseL = 'pointe'; R.look = [.8, -.2]; R.sourcil = .7; R.tilt = wob(tq, .6, .04); }
  const tv = 1 - ease(seg(ld, Dd[1] * .6, Dd[1] + .5));
  c.save(); cam(c, t, [[0, 560, 400, 1.2], [A[0] + .4, 680, 380, 1.4], [B[0], 520, 380, 1.25], [C[0] + .2, 700, 360, 1.42], [Dd[0], 520, 390, 1.2], [DUREE, 520, 400, 1.12]]);
  if (tv < 1) { c.save(); }
  dessineSalon(c, t, R, M, { tv, ecran: tv > .05 ? emission(1, { chapeaux: 0, panneau: 0, vedette: false, marchand: false }) : null, derriere: gueridon }, (cc) => {
    const a = mainScene(M, 1), b = mainScene(M, -1), x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2 + 6;
    if (ch === 'mains' || ch === 'monte') chapeauMode(cc, x, y, .44 + (ch === 'monte' ? .14 * ease(seg(lc, 0, .7)) : 0), 0);
    if (ch === 'pose') chapeauMode(cc, GUER[0], GUER[1] - 130, .44, 0);
  });
  if (tv < 1) c.restore();
  c.restore();
  if (tv < 1) { c.fillStyle = `rgba(10,20,30,${.18 * (1 - tv)})`; c.fillRect(0, 0, W, H); }   // la pièce s'assombrit un peu quand l'écran s'éteint
}
