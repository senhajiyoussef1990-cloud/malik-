// SCÈNE 05 — TV. 
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => unis(cc, t, u, { parle: ['s05a'] })), XB = ((cc, t, u) => villageNB(cc, t, { nuit: .7, affiche: 1, ombre: .3 + .3 * Math.sin(t * 2) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
