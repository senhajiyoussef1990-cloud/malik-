// SCÈNE 13 — Plan 24 (TV + héros). Dans l'usine, devant les rangées d'ampoules, le renard en dévisse une et la fait tourner entre ses doigts : « Certaines pannes sont prévues d'avance. » Le mouton croise les bras, malin.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.6, -.3]; M.look = [-.8, -.1];
  R.handR = [120, -640]; R.poseR = 'poing';
  if (la > A[1] * .5) { R.look = [.9, 0]; R.sourire = .7; M.handL = [60, -540]; M.handR = [-60, -540]; M.poseL = M.poseR = 'poing'; M.sourire = .7; M.lid = .5; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => usineNB(cc, t, { panneau: 'DURÉE : 1 000 h' }), (cc) => { heros(cc, R, M); const h = mainScene(R, 1); ampouleC(cc, h[0] + 4, h[1] - 30, .45, Math.sin(t * 3) * .5, .5); });
  debutFlash(c, t);
}
