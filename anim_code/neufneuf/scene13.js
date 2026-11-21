// SCÈNE 13 — Plan 24 (TV + héros). Dans l’épicerie, le renard tient une étiquette « 9,99 F » et pose son doigt sur le premier chiffre : « Un centime pour tromper ton œil. » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.6, .3]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [40, -640]; R.poseL = 'pointe';
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => epicerieNB(cc, t, { neuf: 1 }), (cc) => { heros(cc, R, M); const a = mainScene(R, 1); cc.save(); cc.translate(a[0] + 10, a[1] - 10); F(cc, poly([[-56, -26], [48, -26], [62, 0], [48, 26], [-56, 26]]), '#fff1c0', 2.5); cc.font = 'bold 24px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#c8281c'; cc.fillText('9,99 F', 4, 9); cc.restore(); });
  debutFlash(c, t);
}
