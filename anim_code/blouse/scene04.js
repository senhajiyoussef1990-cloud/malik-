// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => congresNB(cc, t, { derriere: (c2) => { for (let k = 0; k < 3; k++) dessine(c2, MEDECIN(t, 140 + k * 140, { face: 1, look: [.6, 0], froncer: .4 })); } })), XB = ((cc, t, u) => congresNB(cc, t, { derriere: (c2) => dessine(c2, PUBLICITAIRE(t, 460, { face: 1, look: [.7, -.3], sourcil: .6, handR: [120, -640], poseR: 'pointe' }), drawVendeur) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
