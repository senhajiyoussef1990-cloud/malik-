// SCÈNE 04 — Plans 06-07 (TV). s04a : l’épicier derrière son comptoir ; partout, des prix ronds : 1 F, 2 F, 10 F.
// s04b : sur le pas de sa porte, il regarde la boutique d’en face : CHEZ DUPONT, « 0,99 F », et une file de clientes.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.0], [B[0], 400, 360, 1.25]]); epicerieNB(cc, t, { derriere: (c2) => dessine(c2, EPICIER(t, 640, { face: 1, look: [.4, .1], sourire: .6, handR: [100, -540], poseR: 'ouverte' })) }); }
    else { cam(cc, t, [[B[0], 540, 420, 1.0], [DUREE, 760, 420, 1.15]]); rivauxNB(cc, t, { derriere: (c2) => { dessine(c2, EPICIER(t, 250, { face: 1, look: [.9, 0], froncer: .6, sourcil: .8 })); for (let k = 0; k < 3; k++) dessine(c2, figurant(t, 700 + k * 110, [1, 4, 0][k], { s: .44, y: 790, face: -1, look: [-.5, -.2] })); } }); }
  });
  debutFlash(c, t);
}
