// SCÈNE 04 — Plans 06-07 (TV). « Un petit incident survient sur la place. » Le facteur renverse quelques fleurs sur les chaussures d'un passant ; tout le monde sursaute.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => { const lb = t - B[0]; cam(cc, t, [[0, 540, 405, 1.0], [B[0], 560, 520, 1.4], [DUREE, 560, 520, 1.4]]); if (lb < 0) momentPlace(cc, t, 0); else momentPlace(cc, t, 1, seg(lb, 0, 1.2)); });
  debutFlash(c, t);
}
