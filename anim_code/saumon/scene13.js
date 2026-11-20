// SCÈNE 13 — Plan 24 (TV + héros). Devant l'étal du marché, le renard décolle l'étiquette « SĀMON » et la recolle sur le poisson : « Change l'étiquette, et le goût change dans la tête. » Le mouton rit doucement.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 720); voix(R, ['s13a'], t);
  R.look = [.6, .3]; M.look = [-.8, .2]; M.sourire = .6;
  const k = ease(seg(la, .2, 1.2)); R.handR = [lerp(104, 200, k), lerp(-440, -560, k)]; R.poseR = 'poing';
  if (la > A[1] * .6) { R.look = [.9, 0]; R.sourire = 1; M.rire = 1; M.sourire = 1; R.handL = [-104, -440]; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.15], [DUREE, 540, 420, 1.2]], (cc) => marcheNB(cc, t, {}), (cc) => { heros(cc, R, M); const h = mainScene(R, 1); cc.save(); cc.translate(h[0] + 30, h[1]); cc.rotate(-.1 + Math.sin(t * 3) * .05); F(cc, poly([[-50, -20], [40, -20], [52, 0], [40, 20], [-50, 20]]), '#fbf6ea', 2.5); cc.font = 'bold 20px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#c8382a'; cc.fillText('SĀMON', 0, 7); cc.restore(); });
  debutFlash(c, t);
}
