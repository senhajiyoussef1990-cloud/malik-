// SCÈNE 01 — Plans 01-02. Le mouton regarde l'affiche « LA MODE ! » ; le renard la désigne (s01a).
// Le mouton file au miroir, pose le chapeau improbable sur sa tête, fier… puis doute (s01b).
const T1 = L.s01a[0], D1 = L.s01a[1], T2 = L.s01b[0], D2 = L.s01b[1];
const DUREE = (typeof GRILLE !== "undefined" ? GRILLE : T2 + D2 + 1.2);
const X_AFF = 215, X_MIR = 640;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01a'], t), M = voix(moutonBase(t), ['s01b'], t);
  const la = t - T1, lb = t - T2, fin1 = T1 + D1;
  // ---- le renard
  R.x = 470; R.look = [-.4, -.3];
  if (la >= 0 && t < fin1 + .3) { const k = ease(seg(la, 0, .45)); R.handL = [lerp(-104, -330, k), lerp(-440, -800, k) + wob(tq, 1.6, 5 * k)]; R.poseL = 'pointe'; R.look = [-.9, -.5]; R.sourcil = .9; R.tilt = -.06; R.lean = -.03 * k; }
  else if (lb >= 0) { R.look = [.9, -.1]; R.lid = .62; R.sourcil = .5; R.handR = [150, -560]; R.poseR = 'repos'; }
  // ---- le mouton : à l'affiche, puis marche jusqu'au miroir
  const u = ease(seg(t, fin1 + .1, T2 - .05));
  M.x = lerp(X_AFF, X_MIR, u); M.look = [-.5, -.9]; M.froncer = .3; M.sourire = .4;
  M.handR = [70, -430]; M.poseR = 'poing';
  if (u > 0 && u < 1) { M.walk = t * 10; M.bob = Math.abs(Math.sin(t * 10)) * 9; M.face = 1; M.look = [.8, 0]; }
  let tete = 0;                                                         // 0 = chapeau en main, 1 = sur la tête
  if (lb >= 0) {
    tete = ease(seg(lb, 0, .5)); M.look = [0, -.4];
    if (tete < 1) { M.handR = [lerp(70, 20, tete), lerp(-430, -820, tete)]; M.handL = [lerp(-104, -40, tete), lerp(-366, -800, tete)]; M.poseL = 'ouverte'; }
    else if (lb < D2 * .55) { M.handR = [70, -380]; M.poseR = 'poing'; M.handL = [-60, -840]; M.poseL = 'ouverte'; M.sourire = 1.1; M.froncer = 0; M.lean = -.05; M.tilt = .06; M.look = [-.3, -.5]; }   // fier
    else { M.handL = [-30, -640]; M.poseL = 'poing'; M.froncer = .95; M.sourire = -.3; M.look = [.7, .3]; M.tilt = -.08; M.oreille = -.15; }                                    // le doute
    if (tete >= 1) M.chapeau = CHAP_TETE(-.06 + wob(tq, .5, .02));
  }
  // ---- caméra
  c.save();
  cam(c, t, [[0, 540, 405, 1.0], [T1 + .2, 300, 330, 1.28], [fin1 + .3, 360, 360, 1.12], [T2 - .2, 600, 330, 1.32], [T2 + D2 * .6, 620, 330, 1.38], [DUREE, 560, 380, 1.12]]);
  const reflet = (cc) => { if (M.chapeau && Math.abs(M.x - X_MIR) < 30) {                // le reflet du chapeau dans le miroir
    const [mx, my] = SALON.miroir; cc.save(); cc.beginPath(); cc.ellipse(mx, my, 70, 96, 0, 0, 7); cc.clip(); cc.globalAlpha = .35; chapeauMode(cc, mx + 4, my + 40, .5, .06); cc.restore(); } };
  dessineSalon(c, t, R, M, { derriere: reflet }, (cc) => {
    if (tete < 1) { const [hx, hy] = mainScene(M, 1); chapeauMode(cc, hx, hy - 4 - tete * 30, .42 + tete * .14, -.3 + tete * .3); }
  });
  c.restore();
}
