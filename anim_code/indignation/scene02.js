// SCÈNE 02 — Plans 03-04. Le mouton montre la multitude de réactions sous la manchette : « Tout le monde s'indigne ! Regarde ces réactions. »
// Le renard approche une loupe du bas de l'article et de sa date : « La colère voyage vite. Les détails voyagent moins. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 660; M.handL = [-170, -560]; M.poseL = 'poing'; M.froncer = .9; M.sourire = -.5; M.look = [-.6, .6]; if (la >= 0) { M.handR = [-80, -480]; M.poseR = 'pointe'; }
  R.x = 420; R.look = [.8, .5]; let lp = 0; if (lb >= 0) { lp = ease(seg(lb, 0, .5)); R.handR = [lerp(104, 250, lp), lerp(-440, -460, lp)]; R.poseR = 'poing'; R.lean = .06 * lp; R.lid = .45; M.handR = [104, -366]; M.poseR = 'repos'; }
  c.save(); cam(c, t, [[0, 600, 430, 1.45], [DUREE, 600, 440, 1.5]]);
  dessineSalon(c, t, R, M, {}, (cc) => { const a = mainScene(M, -1); journalColere(cc, a[0] + 90, a[1] + 60, .52, { rot: -.05 }); if (lp > 0) { const [hx, hy] = mainScene(R, 1); loupe(cc, hx + 10, hy - 30, .7, -.4); } });
  c.restore();
}
