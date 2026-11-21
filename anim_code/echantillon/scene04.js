// SCÈNE 04 — Plans 06-07 (TV). s04a : dans le hall, des quêteurs en longue robe se glissent entre les voyageurs pressés et leurs valises.
// s04b : gros plan : la main du quêteur tend une fleur, toujours la même.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.0], [B[0], 560, 430, 1.06]]); aeroportNB(cc, t, { derriere: (c2) => { for (const [x, f] of [[380, 1], [760, -1]]) { const Q = QUETEUR(t, x + Math.sin(t + x) * 30, { face: f, look: [f * .6, 0], sourire: .8, handR: [90, -560], poseR: 'poing' }); dessine(c2, Q); const h = mainF(Q, 1); fleurNB(c2, h[0], h[1] + 20, .6, f * .2); } } }); }
    else { cam(cc, t, [[B[0], 560, 360, 1.5], [DUREE, 600, 330, 1.7]]); aeroportNB(cc, t, { voyageurs: 0, derriere: (c2) => { const Q = QUETEUR(t, 480, { face: 1, look: [.7, .1], sourire: 1, handR: [170, -580], poseR: 'poing' }); dessine(c2, Q); const h = mainF(Q, 1); fleurNB(c2, h[0], h[1] + 20, .7, .15 + Math.sin(t * 2) * .05); } }); }
  });
  debutFlash(c, t);
}
