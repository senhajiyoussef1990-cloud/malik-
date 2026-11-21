// SCÈNE 06 — TV. 
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => emotionRaison(cc, t, u)), XB = ((cc, t, u) => auditionNB(cc, t, { derriere: (c2) => { dessine(c2, TEMOIN(t, 540, { y: 700, face: 1, look: [0, .3], froncer: .7 })); dessine(c2, COMMUNICANT(t, 900, { face: -1, look: [-.6, 0], sourire: .3 })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
