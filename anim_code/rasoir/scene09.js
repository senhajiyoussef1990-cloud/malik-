// SCÈNE 09 — Plans 16-17 (TV). s09a : des coupures de magazines s’empilent, toutes avec le même mot : disgracieux, disgracieux, disgracieux.
// s09b : le publicitaire, ventes en hausse derrière lui : « Un complexe bien installé, c’est un client pour la vie ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.08]]); motRepete(cc, t, seg(la, 0, A[1] * .9)); }
    else { cam(cc, t, [[B[0], 460, 420, 1.2], [DUREE, 460, 410, 1.25]]); const P = voix(PUBLICITAIRE(t, 400, { face: 1, look: [.2, -.2], sourire: 1.3, handR: [150, -740], poseR: 'poing' }), ['s09b'], t); agenceNB(cc, t, { ventes: 1, derriere: (c2) => dessine(c2, P, drawVendeur) }); for (let k = 0; k < 4; k++) etuiNB(cc, 720 + k * 70, 760 - (k % 2) * 30, .4, 0); }
  });
  debutFlash(c, t);
}
