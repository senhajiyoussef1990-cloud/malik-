// SCÈNE 13 — Plan 24 (TV + héros). Dans la boutique, le renard tient l’étiquette barrée et hausse les épaules : « Une affaire, par rapport à quoi ? » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [-160, -560]; R.poseL = 'ouverte'; R.sourcil = .7;
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => boutiqueNB(cc, t, { etiq: 1 }), (cc) => { heros(cc, R, M); const a = mainScene(R, 1); cc.save(); cc.translate(a[0] + 20, a[1] - 20); cc.rotate(.1); F(cc, poly([[-50, -40], [44, -40], [58, 0], [44, 40], [-50, 40]]), '#fff1c0', 2.5); cc.font = 'bold 20px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#5a5a5a'; cc.fillText('200 F', 0, -12); ink(cc, 3, '#c8281c'); cc.beginPath(); cc.moveTo(-30, -18); cc.lineTo(30, -18); cc.stroke(); cc.font = 'bold 26px Georgia'; cc.fillStyle = '#c8281c'; cc.fillText('100 F', 0, 24); cc.restore(); });
  debutFlash(c, t);
}
