// SCÈNE 10 — Plans 18-19 (TV). s10a : la réclame du magazine, avec sa demoiselle triste et ses phrases qui font peur.
// s10b : « LA RECETTE » : UN MOT SAVANT + UNE HONTE + UN REMÈDE, que d'autres marques copient.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) reclameMagazine(cc, t, 1); else recette(cc, t, seg(lb, .1, B[1])); });
  debutFlash(c, t);
}
