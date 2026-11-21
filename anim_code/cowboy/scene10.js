// SCÈNE 10 — Plans 18-19 (TV). s10a : « VENTES — APRÈS LE COW-BOY » : les barres s’envolent de 1954 à 1966.
// s10b : sobre : un chapeau de cow-boy posé sur une barrière vide ; la vieille affiche, déchirée, pâlit au vent.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) courbeVentes(cc, t, seg(la, .1, A[1]), 1); else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 420, 470, 1.15]]); chapeauBarriere(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
