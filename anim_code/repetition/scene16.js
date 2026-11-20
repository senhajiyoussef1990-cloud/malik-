// SCÈNE 16 — Plans 26-29 (salon). s16a : il baisse la radio, ouvre son carnet et écrit « à vérifier ». s16b : le renard tapote la page, sans juger.
// s16c : il éteint la radio, ferme le carnet, satisfait, regarde par la fenêtre. s16d : le renard se tourne vers la caméra.
const A = L.s16a, B = L.s16b, C = L.s16c, D = L.s16d, DUREE = D[0] + D[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s16b', 's16d'], t), M = voix(moutonBase(t), ['s16a', 's16c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 740; M.face = 1; let vol = 1, ouvert = 0, ecrit = 0;
  if (t < A[0] + .4) { const k = ease(seg(t, 0, .4)); M.handR = [lerp(104, 160, k), lerp(-366, -540, k)]; M.poseR = 'pointe'; M.look = [.8, .3]; vol = 1 - .6 * k; }   // il baisse le son
  else { vol = .4; M.face = -1; M.look = [0, .7]; ouvert = 1; ecrit = seg(la, .4, A[1]); M.handL = [-60, -520]; M.handR = [40 + Math.sin(t * 14) * 8 * (ecrit < 1), -540]; M.poseL = 'ouverte'; M.poseR = 'poing'; M.froncer = .5; }
  R.x = 470; R.look = [.9, .2];
  if (lb >= 0) { const tap = Math.abs(Math.sin(lb * 9)) * (lb < B[1]); R.handR = [250, -540 - tap * 18]; R.poseR = 'pointe'; R.lean = .06; R.sourire = .9; R.lid = .5; M.look = [-.6, -.1]; M.sourire = .8; }
  if (lc >= 0) { const k = ease(seg(lc, 0, .5)); ouvert = 1 - k; vol = .4 * (1 - ease(seg(lc, .3, .8))); M.face = 1; M.look = [.9, -.3]; M.sourire = 1.1; M.froncer = 0; M.lid = .45; M.handR = [104, -440]; M.poseR = 'repos'; R.handR = [104, -440]; R.poseR = 'repos'; R.lean = 0; }
  if (ld >= 0) { R.look = [0, 0]; R.lid = .5; R.sourcil = .5; R.tilt = -.04; R.handL = [-150, -660]; R.poseL = 'ouverte'; }
  c.save(); cam(c, t, [[0, 760, 400, 1.4], [B[0], 620, 390, 1.32], [C[0], 760, 380, 1.35], [D[0], 470, 330, 1.6], [DUREE, 470, 330, 1.65]]);
  dessineSalon(c, t, R, M, {}, (cc) => {
    radioJoue(cc, t, vol);
    const a = mainScene(M, -1), b = mainScene(M, 1);
    carnet(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 30, .62, [['à vérifier', ecrit]], ouvert, .05);
    if (ouvert > .5 && ecrit < 1) crayon(cc, b[0] + 6, b[1] - 20, .5);
  });
  c.restore();
}
