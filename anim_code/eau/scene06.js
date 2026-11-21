// SCÈNE 06 — Plans 10-11 (TV). s06a : la réclame : PURETÉ · JEUNESSE · MINCEUR, une élégante boit à la bouteille.
// s06b : au Grand Hôtel, chaque table a sa bouteille ; un serveur en apporte d’autres sur son plateau : signe d’élégance.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 380, 1.08]]); reclamePurete(cc, t, seg(la, .1, A[1] * .8)); }
    else { cam(cc, t, [[B[0], 540, 420, 1.05], [DUREE, 600, 420, 1.12]]); restoNB(cc, t, { carafe: 0, derriere: (c2) => { dessine(c2, figurant(t, 420, 4, { s: .46, y: 700, face: 1, look: [.6, 0], sourire: 1 })); dessine(c2, figurant(t, 680, 0, { s: .48, y: 700, face: -1, look: [-.6, 0], sourire: 1 })); const S = marche(SERVEUR(t, lerp(1100, 900, seg(lb, 0, 1.5)), { face: -1, look: [-.6, 0], handR: [-60, -560], poseR: 'ouverte' }), t, seg(lb, 0, 1.5) < 1 ? 6 : 0); dessine(c2, S); const h = mainF(S, 1); F(c2, ell(h[0], h[1] - 4, 50, 8), GRIS.clair, 2); for (let k = 0; k < 3; k++) bouteilleNB(c2, h[0] - 26 + k * 26, h[1] - 6, .3); } }); }
  });
  debutFlash(c, t);
}
