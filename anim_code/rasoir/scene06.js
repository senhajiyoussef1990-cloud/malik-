// SCÈNE 06 — Plans 10-11 (TV). s06a : la réclame du magazine : « La robe sans manches exige des aisselles lisses. »
// s06b : l’escalier des mots : les poils… disgracieux → gênants → HONTEUX.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 380, 1.1]]); reclameAisselles(cc, t, seg(la, .2, A[1])); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); escalierMots(cc, t, seg(lb, .1, B[1])); }
  });
  debutFlash(c, t);
}
