// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton pose calmement le catalogue et son portefeuille. s15b : le renard souligne « besoin, prix, délai » dans un carnet.
// s15c : le mouton regarde la pendule, paisible. s15d : regard amusé entre les deux.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .8;
const [AX, AY] = ARDOISE;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  const pose = ease(seg(la, .2, 1));
  M.x = 650; M.handL = [lerp(-200, -150, pose), lerp(-560, -420, pose)]; M.handR = [lerp(-20, 120, pose), lerp(-560, -420, pose)]; M.poseL = M.poseR = 'poing'; M.look = [-.3, .6]; M.sourire = .6;
  if (pose >= 1) { M.handL = [-104, -366]; M.handR = [104, -366]; M.poseL = M.poseR = 'repos'; }
  R.x = 400; R.look = [.9, .2];
  const u = seg(lb, 0, B[1]);
  if (lb >= 0 && lc < 0) { R.handL = [-150, -600]; R.handR = [40, -600]; R.poseL = 'ouverte'; R.poseR = 'pointe'; R.look = [.2, .6]; }
  if (lc >= 0) { M.look = [-.6, -.8]; M.lid = .45; M.sourire = 1; R.look = [.7, 0]; }
  if (ld >= 0) { M.look = [-1, 0]; R.look = [1, 0]; R.wink = (ld > D[1] * .5 && ld < D[1] * .5 + .4) ? 1 : 0; R.sourire = 1.2; M.rire = ld > D[1] * .6 ? 1 : 0; }
  c.save(); cam(c, t, [[0, 540, 400, 1.3], [C[0], 520, 360, 1.25], [DUREE, 540, 400, 1.2]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { catalogue(cc, 880, 500, .26, { urgence: false, rot: .1 }); portefeuille(cc, 950, 500, .5); } }, (cc) => {
    if (pose < 1) { const a = mainScene(M, -1); catalogue(cc, a[0] + 60, a[1] + 40, .4, { urgence: false }); }
    if (lb >= 0 && lc < 0) { const a = mainScene(R, -1); carnet(cc, a[0] + 90, a[1] - 20, .6, [['besoin ?', clamp(u * 3)], ['prix ?', clamp(u * 3 - 1)], ['délai ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
