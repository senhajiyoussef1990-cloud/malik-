// SCÈNE 13 — Plan 24 (TV + héros). À l'agence, le renard tient d'une main le flacon, de l'autre la réclame qui fait peur : « Méfie-toi de qui vend la maladie et le remède. » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [-150, -620]; R.poseL = 'poing';
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => agenceNB(cc, t, { ventes: 1 }), (cc) => { heros(cc, R, M); const a = mainScene(R, 1), b = mainScene(R, -1); flaconBouche(cc, a[0], a[1] + 30, .4, .1); cc.save(); cc.translate(b[0] - 10, b[1] - 20); F(cc, poly([[-40, -55], [40, -55], [40, 55], [-40, 55]]), '#fbf6ea', 2); cc.font = 'italic bold 9px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#3a1a0a'; cc.fillText('Toujours demoiselle', 0, -36); cc.fillText('d’honneur…', 0, -24); cc.restore(); });
  debutFlash(c, t);
}
