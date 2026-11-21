// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => chapellerieNB(cc, t, { derriere: (c2) => dessine(c2, CHAPELIER(t, 760, { face: -1, look: [-.6, .2], froncer: .5, handR: [-60, -520], poseR: 'poing' })) })), XB = ((cc, t, u) => { arriereBoutique(cc, t, u); dessine(cc, marche(CHAPELIER(t, lerp(1000, 640, Math.min(1, u * 2)), { face: -1, look: [-.6, -.3], handR: [-80, -600], handL: [80, -600], poseR: 'poing', poseL: 'poing' }), t, u < .5 ? 6 : 0)); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
