// SCÈNE 07 — TV + héros. 
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
const X = ((cc, t, u) => { cc.fillStyle = '#d6d2c8'; cc.fillRect(0, 0, W, 620); cc.fillStyle = '#7e7a72'; cc.fillRect(0, 620, W, H - 620); F(cc, poly([[620, 560], [980, 560], [990, 590], [610, 590]]), GRIS.fonce, 3); const P = voix(LECTEUR(t, 760, { face: -1, look: [-.3, .5], sourire: .8, handL: [-60, -520], handR: [60, -520], poseL: 'poing', poseR: 'poing' }), ['s07a'], t); dessine(cc, P); cc.save(); cc.translate(760, 520); F(cc, poly([[-100, -70], [100, -70], [100, 70], [-100, 70]]), GRIS.blanc, 3); cc.font = 'bold 16px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LE JOURNAL', 0, -44); F(cc, poly([[-80, -30], [80, -30], [80, 30], [-80, 30]]), GRIS.noir, 0); cc.restore(); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 150, 300); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourire = .4; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => X(cc, t, seg(la, 0, A[1])), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
