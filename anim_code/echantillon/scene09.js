// SCÈNE 09 — Plans 16-17 (TV). s09a : un grand cercle de gens qui se passent des cadeaux : donner · recevoir · rendre.
// s09b : le quêteur tire sur un fil invisible accroché à la fleur… et le voyageur suit, comme une marionnette.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); cercleDons(cc, t, seg(la, 0, A[1])); }
    else { cam(cc, t, [[B[0], 540, 420, 1.05]]); aeroportNB(cc, t, { voyageurs: 0, derriere: (c2) => { const u = seg(lb, .2, B[1]); const Q = QUETEUR(t, 360, { face: 1, look: [.6, 0], sourire: 1, handR: [80, -760], poseR: 'poing' }); const V = marche(VOYAGEUR(t, lerp(820, 600, u), { face: -1, look: [-.5, -.2], handR: [-120, -600], poseR: 'poing' }), t, u < 1 ? 5 : 0); dessine(c2, Q); dessine(c2, V); const hq = mainF(Q, 1), hv = mainF(V, 1); ink(c2, 2, 'rgba(255,255,255,.9)'); c2.beginPath(); c2.moveTo(hq[0], hq[1]); c2.quadraticCurveTo((hq[0] + hv[0]) / 2, hq[1] - 40, hv[0], hv[1] - 40); c2.stroke(); fleurNB(c2, hv[0], hv[1] + 20, .6, -.3); } }); }
  });
  debutFlash(c, t);
}
