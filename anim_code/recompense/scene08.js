// SCÈNE 08 — Plans 14-15 (TV). Le joueur enchaîne les jetons sans regarder le reste de la fête. Pendant ce temps, une petite fille profite du manège.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0], ess = (t * 1.4) % 1;
    cam(cc, t, [[0, 660, 470, 1.3], [B[0] - .1, 660, 470, 1.3], [B[0] + .5, 400, 430, 1.1], [DUREE, 380, 430, 1.1]]);
    feteNB(cc, t, { manege: 280 }); machine(cc, 760, 760, .95, t, { clignote: true, jeton: ess, tiroir: ess > .6 ? 1 : 0, contenu: 'vide', tourne: t * 4 });
    const J = JOUEUR(t, 560, { look: [.8, .3], sourire: 0, lid: .5, handR: [220, -560 + (ess < .4 ? -20 : 0)], poseR: 'pointe' }); dessine(cc, J); jetons(cc, 520, 790, Math.max(1, 12 - Math.floor(t * 1.4)));
    const P = figurant(t, 200, 1, { s: .36, y: 740, face: 1, chapeau: COIFFE.foulard, rire: (Math.floor(t * 3)) % 2, sourire: 1.4, handL: [-120, -700], handR: [120, -700], poseL: 'ouverte', poseR: 'ouverte' }); P.bob = Math.abs(Math.sin(t * 6)) * 12; if (lb >= 0) dessine(cc, P);
  });
  debutFlash(c, t);
}
