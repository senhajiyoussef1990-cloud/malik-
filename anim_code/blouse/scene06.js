// SCÈNE 06 — TV. 
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => congresNB(cc, t, { derriere: (c2) => { for (let k = 0; k < 4; k++) { const P = MEDECIN(t, 140 + k * 120, { face: 1, look: [.6, .2], sourire: .8, handR: [80, -480], poseR: 'poing' }); dessine(c2, P); const h = mainF(P, 1); cartouche(c2, h[0] + 6, h[1] + 30, .45); } dessine(c2, PUBLICITAIRE(t, 760, { face: -1, look: [-.6, 0], sourire: 1 }), drawVendeur); } })), XB = ((cc, t, u) => sondageMedecins(cc, t, u));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
