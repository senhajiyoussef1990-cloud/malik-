// SCÈNE 13 — Plan 24 (TV + héros). Dans le hall, le renard tient la fleur d’une main, l’autre posée sur le cœur : « Un cadeau qui attend quelque chose, ce n’est pas un cadeau. » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [20, -560]; R.poseL = 'ouverte';
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => aeroportNB(cc, t, { voyageurs: 0 }), (cc) => { heros(cc, R, M); const a = mainScene(R, 1); cc.save(); cc.translate(a[0], a[1] + 20); cc.rotate(.1); ink(cc, 4, '#3a7a3a'); cc.beginPath(); cc.moveTo(0, 0); cc.lineTo(0, -90); cc.stroke(); for (let k = 0; k < 6; k++) { const an = k * 1.047; F(cc, ell(Math.cos(an) * 14, -100 + Math.sin(an) * 14, 10, 10), '#f0a030', 1.5); } F(cc, ell(0, -100, 8, 8), '#c84a10', 1.5); cc.restore(); });
  debutFlash(c, t);
}
