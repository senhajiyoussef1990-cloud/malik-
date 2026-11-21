// SCÈNE 13 — Plan 24 (TV + héros). Devant le four, le renard tient une baguette sous le nez, l’autre main levée en avertissement : « Ton nez fait parfois tes courses. » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [-120, -700]; R.poseL = 'pointe';
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => grandMagasinNB(cc, t, { four: 1, odeur: 1 }), (cc) => { heros(cc, R, M); const a = mainScene(R, 1); cc.save(); cc.translate(a[0], a[1] - 30); cc.rotate(.35); F(cc, smooth([[-10, 0], [10, 0], [12, -150], [0, -160], [-12, -150]]), '#d89850', 2.5); for (let k = 0; k < 4; k++) { ink(cc, 1.5, '#8a5a20'); cc.beginPath(); cc.moveTo(-6, -24 - k * 30); cc.lineTo(7, -16 - k * 30); cc.stroke(); } cc.restore(); });
  debutFlash(c, t);
}
