// SCÈNE 10 — TV. 
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); cc.save(); cc.translate(540, 420); F(cc, poly([[-220, -300], [220, -300], [220, 300], [-220, 300]]), '#bcb8ae', 6); cc.font = 'bold 30px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LA FABRICATION', 0, -60); cc.fillText('DU CONSENTEMENT', 0, -16); cc.font = 'italic 22px Georgia'; cc.fillText('(un livre critique, des décennies plus tard)', 0, 160); cc.restore(); }), XB = ((cc, t, u) => serrure(cc, t, u, { r: 90 }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
