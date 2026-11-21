// SCÈNE 04 — Plans 06-07 (TV). s04a : le directeur, montre à gousset en main, regarde les clients filer droit vers la sortie.
// s04b : des ouvriers installent un four à pain juste à l’entrée ; la porte reste grande ouverte.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.0]]); grandMagasinNB(cc, t, { derriere: (c2) => { dessine(c2, figurant(t, 900, 0, { s: .5, y: 790, face: -1, look: [-.7, 0], froncer: .6, lunettes: 1, handR: [-60, -520], poseR: 'poing' })); for (let k = 0; k < 3; k++) { const u = (t * .3 + k * .33) % 1; dessine(c2, marche(figurant(t, lerp(120, 780, u), [1, 2, 4][k], { s: .46, y: 800, face: 1, look: [.6, 0] }), t, 12)); } } }); }
    else { cam(cc, t, [[B[0], 400, 440, 1.2]]); grandMagasinNB(cc, t, { four: 1, derriere: (c2) => dessine(c2, BOULANGER(t, 420, { y: 790, face: -1, look: [-.6, .2], sourire: .8, handR: [-100, -520], poseR: 'ouverte' })) }); }
  });
  debutFlash(c, t);
}
