// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => disputes(cc, t, u)), XB = ((cc, t, u) => villageNB(cc, t, { nuit: .6, derriere: (c2) => dessine(c2, MAIRE(t, 630, { y: 560, s: .38, face: 1, look: [.5, -.5], sourcil: .7, handR: [60, -760], poseR: 'pointe' })) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
