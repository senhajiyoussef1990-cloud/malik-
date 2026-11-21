// SCÈNE 13 — Plan 24 (TV + héros). Devant la pile de disques non désirés, le renard tient la carte de refus : « Ce que tu ne refuses pas, tu le paies. » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -660]; R.poseR = 'poing';
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => salonClient(cc, t, { pile: 9, factures: 6 }), (cc) => { heros(cc, R, M); const a = mainScene(R, 1); cc.save(); cc.translate(a[0] + 20, a[1] - 20); cc.rotate(.1); F(cc, poly([[-50, -32], [50, -32], [50, 32], [-50, 32]]), '#fbf6ea', 2.5); cc.font = 'bold 12px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#c8281c'; cc.fillText('CARTE DE REFUS', 0, -10); cc.fillStyle = '#3a3a3a'; cc.fillText('☐ Non merci', 0, 14); cc.restore(); });
  debutFlash(c, t);
}
