// SCÈNE 06 — TV. 
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => ateliersPancartes(cc, t, u)), XB = ((cc, t, u) => { cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); cc.save(); cc.translate(540, 410); cc.rotate(-.03); F(cc, poly([[-260, -340], [260, -340], [260, 340], [-260, 340]]), GRIS.blanc, 4); cc.font = 'bold 40px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LE COURRIER', 0, -280); cc.font = 'bold 34px Georgia'; ['COLÈRE', 'SPONTANÉE', 'DES CITOYENS'].forEach((l, k) => { if (u * 3 > k) cc.fillText(l, 0, -190 + k * 50); }); manifestants(cc, t, 0); cc.restore(); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
