// SCÈNE 11 — Plans 19-20 (TV, avec nos deux héros en couleur). Le mouton, lanterne en main : « On vérifie ensemble, sans se précipiter ? »
// Le renard : « Oui, mais sans prendre de risque inutile. » Ils s'arrêtent à bonne distance de la porte, lanternes basses.
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0], av = ease(seg(t, B[0] - .2, DUREE - .4));
  const R = voix(renardBase(t), ['s11b'], t), M = voix(moutonBase(t), ['s11a'], t);
  R.x = lerp(260, 380, av); R.y = 790; R.s = .5; M.x = lerp(780, 680, av); M.y = 800; M.s = .47; M.look = [-.9, -.1]; R.look = [.9, 0];
  if (av > 0 && av < 1) { R.walk = t * 8; M.walk = t * 8; R.bob = Math.abs(Math.sin(t * 8)) * 6; M.bob = Math.abs(Math.cos(t * 8)) * 6; }
  M.handR = [130, -400]; M.poseR = 'poing'; R.handL = [-130, -460]; R.poseL = 'poing';
  if (la >= 0 && lb < 0) { M.handL = [-150, -560]; M.poseL = 'ouverte'; M.froncer = .5; M.sourire = .2; }
  if (lb >= 0) { R.handR = [150, -560]; R.poseR = 'ouverte'; R.sourcil = .6; M.look = [.4, -.2]; R.look = [.4, -.1]; }
  const keys = [[0, 540, 470, 1.15], [DUREE, 540, 460, 1.25]];
  nbEtCouleur(c, t, keys, (cc) => ruelleNB(cc, t, { nuit: .9, lanterne: [mainScene(R, -1), mainScene(M, 1)] }), (cc) => {
    for (const P of [R, M]) { cc.save(); cc.translate(0, -P.bob); (P === R ? drawRenard : drawMouton)(cc, P); cc.restore(); }
    const a = mainScene(R, -1), b = mainScene(M, 1); lanterne(cc, a[0], a[1] + 20); lanterne(cc, b[0], b[1] + 20);
  });
  debutFlash(c, t);
}
