// SCÈNE 12 — TV. 
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => placeNB(cc, t, { court: 0 })), XB = ((cc, t, u) => placeNB(cc, t, { court: 0, derriere: (c2) => dessine(c2, figurant(t, 540, 2, { s: .5, y: 820, face: 1, look: [0, -.2], handR: [140, -700], poseR: 'ouverte' })) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
