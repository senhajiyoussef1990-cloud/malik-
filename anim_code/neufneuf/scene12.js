// SCÈNE 12 — Plans 22-23 (TV). s12a : un chercheur à lunettes devant le tableau noir : « L’EFFET DU CHIFFRE DE GAUCHE » ; le 9 de « 9,99 » entouré à la craie.
// s12b : « 9,99 → ≈ 10 » : arrondis au-dessus !
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) { tableauChercheur(cc, t, seg(la, 0, A[1])); dessine(cc, figurant(t, 170, 0, { s: .5, y: 790, face: 1, look: [.8, -.4], lunettes: 1, tablier: 'blanc', chapeau: () => {}, handR: [150, -700], poseR: 'pointe' })); } else arrondir(cc, t, seg(lb, B[1] * .4, B[1] * .4 + .6)); });
  debutFlash(c, t);
}
