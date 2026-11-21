// SCÈNE 09 — Plans 16-17 (TV). s09a : les boutiques : « cuir » chez le chausseur, « vanille » chez le tailleur.
// s09b : un gramophone : musique LENTE, on flâne… puis RAPIDE, on circule.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) boutiquesOdeurs(cc, t, 1); else musiqueNB(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
