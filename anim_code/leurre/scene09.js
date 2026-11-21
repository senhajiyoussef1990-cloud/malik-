// SCÈNE 09 — Plans 16-17 (TV). s09a : le tableau des prix, le « MOYEN » absurde à 6,50 F à côté du « GRAND » à 7 F ; des spectateurs glissent l’un après l’autre vers le grand.
// s09b : le vendeur, hilare, tend un seau géant : « Petit, moyen, grand. Et tout le monde prend le grand ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.0], [B[0], 600, 420, 1.08]]); cinemaNB(cc, t, { brille: 1 }); for (let k = 0; k < 3; k++) { const u = seg(la, k * .7, k * .7 + 2); dessine(cc, marche(figurant(t, lerp(-60 - k * 120, 640 + k * 50, u), [2, 4, 0][k], { s: .5, y: 800, face: 1, look: [.6, -.4] }), t, u < 1 ? 6 : 0)); } }
    else { cam(cc, t, [[B[0], 560, 420, 1.12]]); cinemaNB(cc, t, { derriere: (c2) => { const V = voix(VENDEUR(t, 560, { s: .46, y: 600, face: 1, look: [.3, -.1], sourire: 1.3, rire: Math.sin(t * 7) > .4 ? 1 : 0, handR: [120, -520], poseR: 'ouverte', handL: [-120, -520], poseL: 'ouverte' }), ['s09b'], t); dessine(c2, V); } }); popcornNB(cc, 560, 470, .7, 'GRAND'); }
  });
  debutFlash(c, t);
}
