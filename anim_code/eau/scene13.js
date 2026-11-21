// SCÈNE 13 — Plan 24 (TV + héros). Au laboratoire, le renard tient d’une main la bouteille de source, de l’autre un simple verre d’eau du robinet : « Ce qui est gratuit, certains rêvent de te le vendre. » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [-150, -620]; R.poseL = 'poing';
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => laboNB(cc, t, 1), (cc) => { heros(cc, R, M); const a = mainScene(R, 1), b = mainScene(R, -1); bouteilleCouleur(cc, a[0], a[1] + 40, .45, .1); verreEau(cc, b[0], b[1] + 30, .6); });
  debutFlash(c, t);
}
