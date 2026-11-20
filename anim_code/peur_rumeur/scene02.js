// SCÈNE 02 — Plans 03-04. Le mouton pointe l'ombre sombre imprimée : « Mais la photo fait vraiment peur ! »
// Le renard retourne la page et révèle le petit paragraphe : « La peur peut courir plus vite que l'information. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 640; M.froncer = 1; M.sourire = -.6; M.oreille = -.3; M.handL = [-200, -560]; M.poseL = 'poing'; M.look = [-.6, .4];
  if (la >= 0) { M.handR = [-120, -560 + Math.sin(t * 30) * 4]; M.poseR = 'pointe'; M.lean = .05; }
  R.x = 410; R.look = [.8, .3];
  const tour = ease(seg(lb, .1, .7)); let tient = 'mouton';
  if (lb >= 0) { tient = 'renard'; R.handR = [200, -600]; R.handL = [40, -600]; R.poseL = R.poseR = 'poing'; R.lean = .04; R.look = [.6, .5]; M.handL = [-104, -366]; M.handR = [104, -366]; M.poseL = M.poseR = 'repos'; M.froncer = .6; M.sourire = 0; M.look = [-1, .4]; M.lean = .06;
    if (tour >= 1) { R.handL = [-40, -640]; R.poseL = 'pointe'; R.sourcil = .8; } }
  c.save(); cam(c, t, [[0, 560, 380, 1.5], [B[0] + .2, 520, 380, 1.55], [DUREE, 520, 380, 1.6]]);
  dessineSalon(c, t, R, M, {}, (cc) => {
    if (tient === 'mouton') { const a = mainScene(M, -1); journal(cc, a[0] + 80, a[1] - 50, .62, { rot: -.05 }); }
    else { const a = mainScene(R, 1); journal(cc, a[0] + 10, a[1] + 30, .56, { rot: .04, tourne: tour }); }
  });
  c.restore();
}
