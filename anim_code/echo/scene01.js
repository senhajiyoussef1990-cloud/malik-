// SCÈNE 01 — Plans 01-02. Le mouton lit un petit journal aux titres tous identiques : « C'est drôle : tout le monde dit la même chose ! »
// Le renard montre deux haut-parleurs tournés l'un vers l'autre sur une étagère : « Et si tu n'entendais que les mêmes voix ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 640; M.handL = [-150, -560]; M.handR = [40, -560]; M.poseL = M.poseR = 'poing'; M.look = [-.3, .6]; M.sourire = .8; M.sourcil = .6;
  R.x = 420; R.look = [.8, .2]; if (lb >= 0) { R.handR = [330, -620]; R.poseR = 'pointe'; R.look = [1, -.2]; R.sourcil = .7; }
  c.save(); cam(c, t, [[0, 640, 420, 1.35], [DUREE, 660, 420, 1.35]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => hautParleurs(cc, 905, 450, t, 1) }, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); petitJournal(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 40, .5, -.04); });
  c.restore();
}
