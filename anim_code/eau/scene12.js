// SCÈNE 12 — Plans 22-23 (TV). s12a : le panneau « BOUTEILLE UTILE » (inondation, eau coupée, voyage lointain) face à « LA RÈGLE » : le robinet.
// s12b : au laboratoire, l’analyse de l’eau se coche ligne après ligne : bactéries, nitrates, plomb, pesticides…
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); casUtiles(cc, t, seg(la, .2, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 700, 380, 1.15]]); laboNB(cc, t, seg(lb, .2, B[1])); } });
  debutFlash(c, t);
}
