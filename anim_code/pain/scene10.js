// SCÈNE 10 — Plans 18-19 (TV). s10a : le boulanger, les bras croisés devant le four, sûr de lui : « Le client croit choisir. C’est l’ambiance qui choisit pour lui ! »
// s10b : « LE MARKETING SENSORIEL » : la vue, l’ouïe, l’odorat, le goût, le toucher.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 400, 440, 1.2]]); grandMagasinNB(cc, t, { four: 1, odeur: 1, derriere: (c2) => dessine(c2, voix(BOULANGER(t, 460, { y: 790, face: 1, look: [.5, -.1], sourire: 1.2, handR: [40, -500], handL: [-40, -500], poseR: 'poing', poseL: 'poing' }), ['s10a'], t)) }); } else { cam(cc, t, [[B[0], 540, 405, 1.0]]); cinqSens(cc, t, seg(lb, .1, B[1])); } });
  debutFlash(c, t);
}
