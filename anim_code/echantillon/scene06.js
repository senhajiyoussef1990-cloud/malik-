// SCÈNE 06 — Plans 10-11 (TV). s06a : les pièces tombent dans le bol, l’une après l’autre ; des voyageurs donnent en soupirant, montre au poignet.
// s06b : à côté, une poubelle déborde de fleurs jetées.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 560, 440, 1.1]]); aeroportNB(cc, t, { voyageurs: 0, derriere: (c2) => { const Q = QUETEUR(t, 420, { face: 1, look: [.6, .2], sourire: 1, handR: [170, -560], poseR: 'ouverte' }); dessine(c2, Q); const hq = mainF(Q, 1); bolDons(c2, hq[0], hq[1] + 10, .9, Math.floor(seg(la, 0, A[1]) * 14)); for (let k = 0; k < 2; k++) dessine(c2, VOYAGEUR(t, 700 + k * 170, { v: k * 2, face: -1, look: [-.5, .4], froncer: .7, handR: [-100, -560], poseR: 'poing' })); } }); }
    else { cam(cc, t, [[B[0], 700, 420, 1.2]]); aeroportNB(cc, t, { derriere: (c2) => poubelleFleurs(c2, 760, 790, 1.1, Math.floor(seg(lb, 0, B[1]) * 20) + 4) }); }
  });
  debutFlash(c, t);
}
