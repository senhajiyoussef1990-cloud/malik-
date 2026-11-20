// SCÈNE 08 — Plans 14-15 (TV). s08a : gros plan sur le dos du paquet ; une loupe géante glisse jusqu'à la ligne minuscule : « Poids net : 200 g — Prix au kilo : 10 F ».
// s08b : la balance de Roberval : à gauche l'ancien paquet (250 g, 15 biscuits), à droite le nouveau (200 g, 12) — le plateau de gauche descend.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [A[0] + A[1] * .5, 540, 560, 1.4]]); dosPaquet(cc, t, seg(la, A[1] * .3, A[1] * .7)); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 420, 1.06]]); balanceNB(cc, t, seg(lb, .3, 1.5)); }
  });
  debutFlash(c, t);
}
