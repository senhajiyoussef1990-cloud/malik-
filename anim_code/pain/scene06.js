// SCÈNE 06 — Plans 10-11 (TV). s06a : la jauge de l’APPÉTIT monte, le ventre gargouille.
// s06b : à côté, le panier se remplit de choses inutiles.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) jaugeFaim(cc, t, seg(la, .2, A[1])); else jaugeFaim(cc, t, 1, { panier: seg(lb, .1, B[1]) }); });
  debutFlash(c, t);
}
