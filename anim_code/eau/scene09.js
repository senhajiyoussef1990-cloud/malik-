// SCÈNE 09 — Plans 16-17 (TV). s09a : un léger goût de « chlore » au robinet devient un panneau de danger.
// s09b : le vendeur devant le graphique « LE PRIX D’UN LITRE » : robinet ×1, bouteille ×1000 : « Mille fois plus cher que le robinet, et ils en redemandent ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 460, 380, 1.1]]); robinetNB(cc, t, { chlore: seg(la, .3, 1.2) }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); prixEau(cc, t, seg(lb, 0, B[1] * .7)); const P = voix(VENDEUR(t, 470, { s: .4, y: 800, face: 1, look: [.6, -.3], sourire: 1.3, handR: [150, -740], poseR: 'poing' }), ['s09b'], t); dessine(cc, P, drawVendeur); }
  });
  debutFlash(c, t);
}
