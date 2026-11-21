// SCÈNE 09 — TV. 
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => propagation(cc, t, u)), XB = ((cc, t, u) => theatreNB(cc, t, { claque: [3, 6, 12, 15, 24], app: 1, derriere: (c2) => dessine(c2, voix(CHEF(t, 200, { y: 860, s: .6, face: 1, look: [.5, -.2], sourire: 1.2, handR: [150, -700], poseR: 'poing' }), ['s09b'], t)) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
