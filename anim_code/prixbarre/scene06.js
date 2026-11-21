// SCÈNE 06 — Plans 10-11 (TV). s06a : une balance : à gauche « 200 F », vu en premier ; à droite « 100 F » qui paraît soudain léger : « pas cher ! »
// s06b : « L’ANCRAGE » : une ancre plonge, entraînant l’étiquette « 200 F » au fond de l’esprit.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) balanceComparaison(cc, t, seg(la, .3, A[1] * .8)); else ancrage(cc, t, seg(lb, .1, B[1] * .8)); });
  debutFlash(c, t);
}
