// SCÈNE 12 — Plans 22-23 (TV). s12a : « AUJOURD'HUI, ON SOUPÇONNE… » le téléphone, l'imprimante, la machine à laver, chacun avec un petit cadran qui tourne.
// s12b : un tampon géant s'abat sur le dossier « OBSOLESCENCE PROGRAMMÉE » : « PUNIE PAR LA LOI ».
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) appareils(cc, t, seg(la, .1, A[1])); else tamponLoi(cc, t, seg(lb, .4, .9)); });
  debutFlash(c, t);
}
