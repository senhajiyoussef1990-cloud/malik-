// SCÈNE 07 — Plans 12-13 (TV). Un rédacteur pose le mot « FÊTE » au-dessus de la première photo ; un second écrit « INCIDENT » sur la seconde.
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 330, 430, 1.25], [B[0] - .1, 330, 430, 1.25], [B[0] + .4, 750, 430, 1.25], [DUREE, 750, 430, 1.25]]);
    redaction(cc, t);
    maquette(cc, 330, 430, .85, 'FÊTE !', 'fete', seg(la, .2, A[1]));
    maquette(cc, 750, 430, .85, 'INCIDENT !', 'flaque', seg(lb, .2, B[1]));
    const R1 = figurant(t, 150, 0, { s: .5, y: 800, face: 1, look: [.8, .4], sourire: 1.1, handR: [140, -620], poseR: 'pointe' }); dessine(cc, R1);
    const R2 = figurant(t, 940, 2, { s: .5, y: 800, face: -1, look: [.8, .4], sourire: -.4, froncer: 1, handR: [140, -620], poseR: 'pointe', chapeau: COIFFE.visiere }); dessine(cc, R2);
  });
  debutFlash(c, t);
}
