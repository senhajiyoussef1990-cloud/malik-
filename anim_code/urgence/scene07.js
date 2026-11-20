// SCÈNE 07 — Plans 12-13 (TV + héros). Le mouton ramasse et lit la liste : « Mais il n'avait même pas besoin de casserole ! »
// Le renard demande poliment au vendeur les conditions : « Demandons ce qui change après la fin. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 640, 880); voix(R, ['s07b'], t); voix(M, ['s07a'], t);
  M.handL = [-60, -560]; M.handR = [60, -560]; M.poseL = M.poseR = 'poing'; M.look = [0, .6]; M.froncer = .6;
  if (la > A[1] * .5) { M.look = [-.6, -.2]; M.sourcil = 1; M.froncer = 0; }
  R.face = -1; R.look = [.8, 0]; if (lb >= 0) { R.handR = [200, -600]; R.poseR = 'ouverte'; R.lean = .04; R.sourcil = .5; }
  nbEtCouleur(c, t, [[0, 600, 460, 1.2], [DUREE, 600, 460, 1.2]], (cc) => {
    standNB(cc, t, { panneau: 1, sablier: .8 });
    dessine(cc, VENDEUR(t, 400, { face: 1, look: [.8, 0], sourire: lb >= 0 ? .4 : 1.2, sourcil: lb >= 0 ? .8 : 0 }), drawVendeur);
  }, (cc) => { heros(cc, R, M); const a = mainScene(M, -1), b = mainScene(M, 1); listeCourses(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 30, .55, -.05); });
  debutFlash(c, t);
}
