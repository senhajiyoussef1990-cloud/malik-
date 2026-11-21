// SCÈNE 09 — Plans 16-17 (TV). s09a : le rayon de face : l’étagère du milieu, à hauteur des yeux, aux produits plus gros, encadrée : « rentable ».
// s09b : à la caisse, les friandises en bas ; un enfant les montre du doigt : « à hauteur d’enfant ».
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) etageres(cc, t, seg(la, .2, A[1])); else etageres(cc, t, 1, { enfant: seg(lb, .2, .8) }); });
  debutFlash(c, t);
}
