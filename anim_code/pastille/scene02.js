// SCÈNE 03 — TV. le personnage de la fable
const A = L.s03a, B = L.s03b, DUREE = B[0] + B[1] + .35;
const XA = ((cc, t, u) => crieurCloche(cc, t, ['s03a'], {})), XB = ((cc, t, u) => crieurCloche(cc, t, null, { foule: 1 }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.06], [B[0], 540, 405, 1.0]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.07]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
