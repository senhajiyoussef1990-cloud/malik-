// SCÈNE 09 — Plans 16-17 (TV). s09a : les gros prix en 9 tombent l’un après l’autre : 9,99 F · 99 F · 999 F.
// s09b : l’épicier, hilare, compte sa caisse : « Un centime de moins, et ils ont l’impression de faire une affaire ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); prixGeants(cc, t, seg(la, .1, A[1] * .85)); }
    else { cam(cc, t, [[B[0], 600, 420, 1.15], [DUREE, 600, 410, 1.2]]); epicerieNB(cc, t, { neuf: 1, derriere: (c2) => { const E = voix(EPICIER(t, 640, { face: 1, look: [.3, .6], sourire: 1.3, rire: Math.sin(t * 6) > .3 ? 1 : 0, handR: [110, -540], poseR: 'ouverte', handL: [-40, -540], poseL: 'poing' }), ['s09b'], t); dessine(c2, E); } }); F(cc, poly([[700, 520], [860, 520], [860, 560], [700, 560]]), GRIS.fonce, 3); for (let k = 0; k < 6; k++) F(cc, ell(720 + k * 24, 514 - (k % 3) * 6, 10, 4), GRIS.blanc, 1.5); }
  });
  debutFlash(c, t);
}
