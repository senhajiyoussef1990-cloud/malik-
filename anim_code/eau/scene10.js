// SCÈNE 10 — Plans 18-19 (TV). s10a : au magasin, le rayon « EAUX — EAUX — EAUX » se remplit de bouteilles en plastique.
// s10b : en mer, des bouteilles flottent par dizaines, jusqu’à l’horizon ; des mouettes passent.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.08]]); rayonEau(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 470, 1.15]]); oceanNB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
