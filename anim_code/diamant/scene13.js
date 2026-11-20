// SCÈNE 13 — Plan 24 (TV + héros). Devant la vitrine illuminée, le renard pose la main sur son cœur : « L'amour ne se mesure pas en carats. » Le mouton sourit, apaisé.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 680); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; M.sourire = .5;
  if (la >= 0) { R.handL = [10, -600]; R.poseL = 'ouverte'; R.lid = .5; R.sourire = .8; }
  if (la > A[1] * .6) { M.sourire = 1; M.lid = .5; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.2], [DUREE, 540, 410, 1.24]], (cc) => bijouterieNB(cc, t, {}), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
