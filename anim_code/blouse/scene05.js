// SCÈNE 05 — TV. 
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => congresNB(cc, t, { derriere: (c2) => dessine(c2, voix(PUBLICITAIRE(t, 460, { face: 1, look: [.6, -.2], sourire: 1.1, handR: [160, -700], poseR: 'poing' }), ['s05a', 's09b'], t), drawVendeur) })), XB = ((cc, t, u) => congresNB(cc, t, { derriere: (c2) => { for (let k = 0; k < 3; k++) { const P = MEDECIN(t, 160 + k * 150, { face: 1, look: [.6, .2], sourire: .6, handR: [80, -480], poseR: 'poing' }); dessine(c2, P); const h = mainF(P, 1); cartouche(c2, h[0] + 6, h[1] + 30, .45); } } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
