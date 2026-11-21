// SCÈNE 09 — Plans 16-17 (TV). s09a : une rangée de gens dans leurs fauteuils : la plupart ne font rien (89 %), un seul se lève (11 %).
// s09b : une main d’entreprise coche d’avance la case qui l’arrange.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) rienFaire(cc, t, seg(la, .2, A[1])); else caseCochee(cc, t, 1, { main: seg(lb, .2, 1.2) }); });
  debutFlash(c, t);
}
