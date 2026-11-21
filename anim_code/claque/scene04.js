// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => theatreNB(cc, t, { claque: [3, 6, 12, 15, 24] })), XB = ((cc, t, u) => { coulisses(cc, t, u); for (let k = 0; k < 3; k++) dessine(cc, figurant(t, 640 + k * 130, k * 2, { s: .46, y: 790, face: -1, look: [-.6, .1], handR: [-90, -560], poseR: 'ouverte' })); dessine(cc, CHEF(t, 300, { face: 1, look: [.7, 0], sourire: 1 })); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
