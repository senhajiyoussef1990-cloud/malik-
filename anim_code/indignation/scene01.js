// SCÈNE 01 — Plans 01-02. Le mouton brandit le journal : « Cette histoire me met en colère ! » Le renard regarde la photo tronquée, calme et attentif.
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 650; M.handL = [-170, -600 + Math.sin(t * 9) * 10 * (lb < 0)]; M.handR = [10, -600 + Math.sin(t * 9) * 10 * (lb < 0)]; M.poseL = M.poseR = 'poing'; M.froncer = 1; M.sourire = -.8; M.look = [-.7, 0]; M.oreille = -.2;
  R.x = 410; R.look = [.8, .4]; R.lid = .55; if (lb >= 0) { R.handR = [150, -600]; R.poseR = 'ouverte'; R.sourcil = .5; R.look = [1, 0]; }
  c.save(); cam(c, t, [[0, 560, 400, 1.35], [DUREE, 560, 400, 1.4]]);
  dessineSalon(c, t, R, M, {}, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); journalColere(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 50, .5, { rot: -.04 }); });
  c.restore();
}
