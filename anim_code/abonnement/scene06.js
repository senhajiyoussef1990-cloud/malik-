// SCÈNE 06 — Plans 10-11 (TV). s06a : la boîte aux lettres, mois après mois : un disque, et sa facture.
// s06b : la CARTE DE REFUS, « à renvoyer avant le 10 ! », et l’horloge qui tourne.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) boiteLettres(cc, t, seg(la, 0, A[1])); else carteRefus(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
