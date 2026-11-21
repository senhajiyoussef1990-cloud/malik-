// SCÈNE 12 — TV. 
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => rueUsine(cc, t, { derriere: (c2) => { for (let k = 0; k < 5; k++) dessine(c2, figurant(t, 160 + k * 180, k, { s: .44, y: 800, face: k % 2 ? -1 : 1, look: [k % 2 ? -.6 : .6, 0], handR: [80, -620], poseR: 'ouverte' })); } })), XB = ((cc, t, u) => lettresJournal(cc, t, 1));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
