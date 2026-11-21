// SCÈNE 12 — TV. 
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.fillStyle = '#9a968e'; cc.fillRect(0, 620, W, H - 620); dessine(cc, MEDECIN(t, 380, { face: 1, look: [.6, .2], sourire: .5, handR: [140, -560], poseR: 'ouverte' })); dessine(cc, figurant(t, 700, 2, { s: .5, y: 790, face: -1, look: [-.6, 0] })); }), XB = ((cc, t, u) => etudesTabac(cc, t, 1));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
