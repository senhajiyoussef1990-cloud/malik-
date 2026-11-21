// SCÈNE 11 — Plans 20-21 (TV + héros). Au grand magasin, le mouton (en couleur) : « Donc l’odeur, la musique, la lumière… tout est calculé ? »
// Le renard : « Souvent, oui. Une ambiance agréable n’est pas toujours innocente. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 640, 400); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.sourcil = .9; M.look = [.5, -.6]; }
  if (lb >= 0) { R.handR = [150, -560 + Math.sin(lb * 6) * 30]; R.poseR = 'ouverte'; R.sourcil = .5; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 600, 400, 1.12], [DUREE, 620, 400, 1.15]], (cc) => grandMagasinNB(cc, t, { four: 1, odeur: 1 }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
