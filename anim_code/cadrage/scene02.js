// SCÈNE 02 — Plans 03-04. Le mouton pointe le sourire de la première photo : « Sur celle-ci, tout paraît merveilleux. »
// Le renard montre le bord du cadre de la seconde, où apparaît le problème : « Sur l'autre, tout semble catastrophique. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 680; M.handL = [-200, -560]; M.poseL = 'poing'; M.look = [-.6, .4]; M.sourire = .9; M.froncer = 0;
  if (la >= 0 && lb < 0) { M.handR = [-110, -600]; M.poseR = 'pointe'; }
  R.x = 420; R.look = [.8, .3];
  if (lb >= 0) { R.handR = [190, -620]; R.poseR = 'pointe'; R.handR[1] += Math.sin(lb * 6) * 8; R.sourcil = .9; R.lean = .05; M.sourire = -.3; M.froncer = .8; M.look = [-1, .4]; }
  c.save(); cam(c, t, [[0, 580, 400, 1.45], [DUREE, 560, 400, 1.5]]);
  dessineSalon(c, t, R, M, {}, (cc) => {
    const a = mainScene(M, -1); journalPhoto(cc, a[0] - 30, a[1] + 40, .5, 'fete', { rot: -.05 });
    const [hx, hy] = mainScene(R, 1); journalPhoto(cc, hx + 60, hy + 60, .5, 'flaque', { rot: .08 });
  });
  c.restore();
}
