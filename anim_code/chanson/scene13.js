// SCÈNE 13 — Plan 24 (TV + héros). Au studio, le renard (en couleur) éteint la lampe « ANTENNE » ; le silence revient : « Ce que tu entends souvent, tu crois l'aimer. » Le mouton tend l'oreille, songeur.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, -.3]; M.look = [-.8, -.2]; M.oreille = .5;
  const coupe = la > A[1] * .2;
  if (la >= 0) { R.handR = [200, -720]; R.poseR = 'pointe'; }
  if (la > A[1] * .5) { R.handR = [104, -440]; R.poseR = 'repos'; R.look = [.9, 0]; R.sourire = .6; M.sourire = .5; M.lid = .5; }
  nbEtCouleur(c, t, [[0, 600, 380, 1.15], [DUREE, 600, 400, 1.2]], (cc) => studioNB(cc, t, { antenne: !coupe, tourne: !coupe, notes: !coupe }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
