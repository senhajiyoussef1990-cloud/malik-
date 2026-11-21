// SCÈNE 12 — TV. 
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.fillStyle = '#9a968e'; cc.fillRect(0, 640, W, H - 640); for (let k = 0; k < 3; k++) { F(cc, poly([[100 + k * 320, 200], [380 + k * 320, 200], [380 + k * 320, 560], [100 + k * 320, 560]]), GRIS.blanc, 4); cc.font = 'bold 24px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText(['JOURNAL A', 'JOURNAL B', 'INDÉPENDANT'][k], 240 + k * 320, 240); } dessine(cc, JOURNALISTE(t, 880, { face: -1, look: [-.6, 0], sourire: .8 })); }), XB = ((cc, t, u) => journalNB(cc, t, {}));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
