// SCÈNE 08 — Plans 14-15 (TV + héros). Le mouton pose les deux titres sur la table sans se précipiter : « Comment savoir ce qui compte vraiment ? »
// Le renard déroule le plan de la place et indique la direction des appareils : « Il faut demander : quel angle manque ? »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0], R = voix(renardBase(t), ['s08b'], t), M = voix(moutonBase(t), ['s08a'], t);
  R.x = 220; R.y = 800; R.s = .5; M.x = 860; M.y = 810; M.s = .47; R.look = [.8, .3]; M.look = [-.6, .4]; M.froncer = .6;
  const u = seg(lb, 0, B[1] + .2);
  if (lb >= 0) { R.handR = [300 + u * 160, -560]; R.poseR = 'pointe'; R.lean = .06; M.look = [-.8, .3]; }
  nbEtCouleur(c, t, [[0, 540, 460, 1.1], [DUREE, 540, 460, 1.15]], (cc) => {
    redaction(cc, t);
    maquette(cc, 280, 600, .5, 'FÊTE !', 'fete'); maquette(cc, 800, 600, .5, 'INCIDENT !', 'flaque');
    if (lb >= 0) { const d = ease(seg(lb, 0, .5)); cc.save(); cc.translate(540, 440); cc.scale(1, d); planPlace(cc, 0, 0, .8, u); cc.restore(); }
  }, (cc) => { for (const P of [R, M]) { cc.save(); cc.translate(0, -P.bob); (P === R ? drawRenard : drawMouton)(cc, P); cc.restore(); } });
  debutFlash(c, t);
}
