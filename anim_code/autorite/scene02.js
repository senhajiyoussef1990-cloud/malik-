// SCÈNE 02 — Plans 03-04. Le mouton pose une paire de lunettes rondes sur son museau : « Alors ces lunettes me rendent savant ? »
// Le renard rit doucement, puis désigne la télévision : « Voyons comment naît une autorité de théâtre. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  const k = ease(seg(la, 0, .5)); M.x = 640; M.handL = [-60, lerp(-366, -820, k)]; M.handR = [60, lerp(-366, -820, k)]; M.poseL = M.poseR = 'poing'; M.look = [-.6, 0];
  if (k >= 1) { M.handL = [-104, -366]; M.handR = [104, -366]; M.poseL = M.poseR = 'repos'; M.sourire = .9; M.tilt = -.06; M.lean = -.04; }
  R.x = 400; R.look = [.9, 0];
  if (la > A[1] * .6 && lb < .6) { R.rire = 1; R.tilt = wob(tq, 3, .05); }
  if (lb >= .3) { R.rire = 0; R.handL = [-260, -560]; R.poseL = 'pointe'; R.look = [-1, .3]; R.sourire = .9; }
  c.save(); cam(c, t, [[0, 560, 380, 1.4], [B[0] + .3, 400, 420, 1.2], [DUREE, 400, 420, 1.2]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => afficheExpert(cc, 150, 200, .7) }, (cc) => { if (k >= 1) lunettesMouton(cc, M); else { const a = mainScene(M, -1), b = mainScene(M, 1); ink(cc, 5, '#3a2410'); cc.beginPath(); cc.arc(a[0] + 10, a[1] - 10, 14, 0, 7); cc.stroke(); cc.beginPath(); cc.arc(b[0] - 10, b[1] - 10, 14, 0, 7); cc.stroke(); } });
  c.restore();
}
