// SCÈNE 12 — Plans 22-23 (TV). s12a : un paquet-cadeau, un grand « Merci ! »… et la chaîne de la dette se brise.
// s12b : le voyageur rend son sourire au quêteur, garde ses pièces, et repart, léger.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) merciLibre(cc, t, seg(la, .2, A[1])); else { aeroportNB(cc, t, { voyageurs: 0, derriere: (c2) => { const u = seg(lb, B[1] * .5, B[1] + .5); dessine(c2, QUETEUR(t, 360, { face: 1, look: [.6, 0], sourire: .6, handR: [170, -560], poseR: 'ouverte' })); const V = marche(VOYAGEUR(t, lerp(640, 1100, u), { face: u > 0 ? 1 : -1, look: [u > 0 ? .6 : -.6, 0], sourire: 1, handR: [-60, -700], poseR: 'ouverte' }), t, u > 0 ? 8 : 0); dessine(c2, V); } }); } });
  debutFlash(c, t);
}
