// SCÈNE 12 — Plans 22-23 (TV). s12a : deux boutiques côte à côte : le MÊME manteau, « 200 F barré / 100 F » ici, « 90 F » là-bas.
// s12b : une bulle de pensée : « j’étais prêt à payer : 80 F ».
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); comparerAilleurs(cc, t, seg(la, .2, A[1]), { bulle: seg(lb, B[1] * .4, B[1] * .4 + .5) }); if (lb >= 0) dessine(cc, figurant(t, 540, 2, { s: .46, y: 800, face: 1, look: [.6, -.6], handR: [60, -700], poseR: 'pointe' })); });
  debutFlash(c, t);
}
