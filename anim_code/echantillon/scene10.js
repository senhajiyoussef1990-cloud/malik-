// SCÈNE 10 — Plans 18-19 (TV). s10a : DÉGUSTATION · ÉCHANTILLON · CADEAU JOINT au courrier.
// s10b : un paquet-cadeau descend au bout d’un fil de pêche… et dessous, l’hameçon.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) echantillonsNB(cc, t, seg(la, 0, A[1])); else cadeauHamecon(cc, t, seg(lb, B[1] * .3, B[1] * .3 + .6)); });
  debutFlash(c, t);
}
