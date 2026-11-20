// SCÈNE 13 — Plan 24 (TV + héros). Au studio, le renard (en couleur) s'approche du grand micro « EN ONDES », prend une voix grave de speaker… puis sourit : « Ce qui ressemble aux informations n'en est pas toujours. » Le mouton rit.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 560, 820); voix(R, ['s13a'], t);
  R.look = [-.2, .1]; M.look = [-.8, 0]; R.lean = .06; R.froncer = .4; R.sourcil = .6;
  if (la > A[1] * .55) { R.look = [.9, 0]; R.lean = 0; R.froncer = 0; R.sourire = 1; M.rire = 1; M.sourire = 1; }
  nbEtCouleur(c, t, [[0, 560, 400, 1.18], [DUREE, 560, 410, 1.22]], (cc) => studio38NB(cc, t, { micros: [480] }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
