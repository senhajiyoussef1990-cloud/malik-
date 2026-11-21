// SCÈNE 12 — Plans 22-23 (TV). s12a : le tableau des prix s’efface : sans le moyen, il ne reste que PETIT et GRAND.
// s12b : la carte « LA VRAIE QUESTION » : « De quoi ai-je besoin ? Combien suis-je prêt à payer ? »
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) cinemaNB(cc, t, { sansMoyen: la > A[1] * .3 ? 1 : 0 }); else vraieQuestion(cc, t, seg(lb, 0, B[1] * .9)); });
  debutFlash(c, t);
}
