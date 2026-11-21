// SCÈNE 05 — TV. 
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { coulisses(cc, t, 1); for (let k = 0; k < 3; k++) dessine(cc, figurant(t, 640 + k * 130, k * 2, { s: .46, y: 790, face: -1, look: [-.6, .1] })); dessine(cc, voix(CHEF(t, 300, { face: 1, look: [.7, -.1], sourire: 1, handR: [170, -700], poseR: 'pointe' }), ['s05a'], t)); }), XB = ((cc, t, u) => theatreNB(cc, t, { claque: [3, 6, 12, 15, 24], etiquettes: 1, app: u > .5 ? 1 : 0 }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
