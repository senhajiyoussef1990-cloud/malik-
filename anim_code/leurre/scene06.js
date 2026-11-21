// SCÈNE 06 — Plans 10-11 (TV). s06a : on retire l’offre « PAPIER » : il ne reste que deux choix… et les résultats basculent : 68 % · 32 %.
// s06b : « LE LEURRE » : un leurre de pêche « MOYEN » se balance au bout de son fil, et le seau « GRAND » se met à scintiller.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) offresNB(cc, t, 1, { sansPapier: 1, choix: [68, 32], barres: seg(la, .4, 1.8) }); else leurrePeche(cc, t, seg(lb, B[1] * .4, B[1] * .4 + .6)); });
  debutFlash(c, t);
}
