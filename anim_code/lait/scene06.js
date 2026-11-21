// SCÈNE 06 — Plans 10-11 (TV). s06a : dans les allées, les clients passent, touchent, et les paniers se remplissent.
// s06b : d’autres magasins copient : le plan se perfectionne, rayon après rayon, avec ses caisses à la sortie.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.0]]); libreServiceNB(cc, t, { derriere: (c2) => { for (let k = 0; k < 3; k++) { const u = (t * .12 + k * .33) % 1; const P = marche(figurant(t, lerp(840, 300, u), [1, 2, 4][k], { s: lerp(.55, .3, u), y: lerp(820, 520, u), face: -1, look: [-.6, 0], handR: [-60, -420], poseR: 'poing' }), t, 6); dessine(c2, P); const h = mainF(P, 1); panierNB(c2, h[0], h[1] + 40 * P.s, P.s * 1.2); for (let j = 0; j < Math.floor(u * 5); j++) produitNB(c2, h[0] - 20 * P.s + j * 10 * P.s, h[1] - 10 * P.s, P.s * .8, j + k); } } }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); planMagasin(cc, t, seg(lb, 0, B[1]), { caisses: 1, noms: ['BISCUITS', 'SAVON', 'BAZAR'] }); }
  });
  debutFlash(c, t);
}
