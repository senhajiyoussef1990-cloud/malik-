// SCÈNE 15 — Plans 26-29 (salon). s15a : « Je veux comparer des sources indépendantes. » s15b : le renard pose un petit panneau « origine ? date ? ».
// s15c : le mouton sourit devant une carte aux multiples chemins. s15d : plan large, télé éteinte, ils se parlent.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 660; M.look = [-.7, .1]; R.x = 410; R.look = [.9, .1];
  let pan = 0; if (lb >= 0) { pan = ease(seg(lb, 0, .5)); R.handR = [lerp(104, 260, pan), lerp(-440, -540, pan)]; R.poseR = 'poing'; }
  if (lc >= 0) { R.handR = [104, -440]; R.poseR = 'repos'; M.handL = [-150, -560]; M.handR = [60, -560]; M.poseL = M.poseR = 'poing'; M.look = [-.3, .6]; M.sourire = 1.1; }
  if (ld >= 0) { M.handL = [-104, -366]; M.handR = [104, -366]; M.poseL = M.poseR = 'repos'; M.look = [-1, 0]; R.look = [1, 0]; R.handR = [150, -560]; R.poseR = 'ouverte'; }
  c.save(); cam(c, t, [[0, 540, 400, 1.3], [D[0], 540, 405, 1.12], [DUREE, 540, 405, 1.08]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { hautParleurs(cc, 905, 450, t, 0); petitJournal(cc, 1000, 500, .25, .1); if (pan > 0) { cc.save(); cc.globalAlpha = pan; F(cc, poly([[480, 612], [600, 612], [600, 560], [480, 560]]), '#fbf4e2', 3); cc.font = 'bold 16px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#1a3a7a'; cc.fillText('origine ?', 540, 582); cc.fillText('date ?', 540, 602); cc.restore(); } } }, (cc) => {
    if (lc >= 0 && ld < 0) { const a = mainScene(M, -1), b = mainScene(M, 1); carteChemins(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 40, .6); }
  });
  c.restore();
}
