// SCÈNE 06 — TV. 
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => aubergeNB(cc, t, { nuit: 1, pages: 3 + Math.floor(u * 2), derriere: (c2) => dessine(c2, AUBERGISTE(t, 900, { face: -1, look: [-.6, .5], sourire: 1, handR: [-140, -480], poseR: 'pointe' })) })), XB = ((cc, t, u) => aubergeNB(cc, t, { pages: 5, derriere: (c2) => { for (let k = 0; k < 2; k++) dessine(c2, VOYAGEUR(t, 380 + k * 140, { v: k * 2, face: 1, look: [.7, .4], sourire: .8 })); dessine(c2, AUBERGISTE(t, 900, { face: -1, look: [-.6, 0], sourire: 1 })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
