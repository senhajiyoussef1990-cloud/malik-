// SCÈNE 09 — Plans 16-17 (TV). s09a : le graphique des ventes du flacon : de 1921 à 1927, les barres montent en flèche.
// s09b : à l'agence, entouré de caisses de flacons, le publicitaire lève son verre : « On ne vend pas un produit. On vend la fin d'une angoisse ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); ventesExplosent(cc, t, seg(la, .1, A[1])); }
    else { cam(cc, t, [[B[0], 460, 420, 1.2], [DUREE, 460, 410, 1.25]]); const P = voix(PUBLICITAIRE(t, 400, { face: 1, look: [.2, -.2], sourire: 1.3, handR: [150, -740], poseR: 'poing' }), ['s09b'], t); agenceNB(cc, t, { ventes: 1, derriere: (c2) => dessine(c2, P, drawVendeur) }); for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) flaconNB(cc, 680 + k * 60, 700 - r * 70, .4); const h = mainF(P, 1); F(cc, smooth([[h[0] - 10, h[1] - 30], [h[0] + 10, h[1] - 30], [h[0] + 4, h[1] - 6], [h[0] - 4, h[1] - 6]]), 'rgba(255,255,255,.5)', 1.5); }
  });
  debutFlash(c, t);
}
