// SCÈNE 10 — Plans 18-19 (TV). s10a : un cerveau relié aux trois prix : 3 F · 6,50 F · 7 F : comparer, toujours comparer.
// s10b : une main glisse les étiquettes à sa guise : celui qui choisit la comparaison guide le choix.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) cerveauCompare(cc, t, seg(la, .2, A[1])); else cerveauCompare(cc, t, 1, { main: seg(lb, .2, 1.2) }); });
  debutFlash(c, t);
}
