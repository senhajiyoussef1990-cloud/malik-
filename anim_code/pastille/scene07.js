// SCÈNE 07 — aujourd'hui.
const A = L.s07a, DUREE = A[0] + A[1] + .5;
const X = ((cc, t, u) => reglagesNotif(cc, t, u));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0], [DUREE, 540, 405, 1.06]]); X(cc, t, seg(t, A[0], A[0] + A[1])); });
  debutFlash(c, t);
}
