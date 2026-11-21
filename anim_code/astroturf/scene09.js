// SCÈNE 09 — TV. 
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => gazon(cc, t, 1)), XB = ((cc, t, u) => rueUsine(cc, t, { derriere: (c2) => { dessine(c2, voix(PATRON(t, 640, { face: -1, look: [-.6, 0], sourire: 1, handR: [-180, -640], poseR: 'pointe' }), ['s05a', 's09b'], t)); for (let k = 0; k < 3; k++) dessine(c2, figurant(t, 160 + k * 120, k, { s: .44, y: 800, face: 1, look: [.6, 0], handR: [80, -540], poseR: 'ouverte' })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
