// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => conseilNB(cc, t, { derriere: (c2) => { for (let k = 0; k < 3; k++) dessine(c2, figurant(t, 240 + k * 200, k * 2, { s: .46, y: 800, face: 1, look: [.7, -.2], froncer: .6, sourcil: .8 })); } })), XB = ((cc, t, u) => conseilNB(cc, t, { derriere: (c2) => { for (let k = 0; k < 3; k++) dessine(c2, figurant(t, 240 + k * 200, k * 2, { s: .46, y: 800, face: 1, look: [.3, .3], froncer: .4 })); dessine(c2, AVOCAT(t, 900, { y: 800, s: .48, face: -1, look: [-.6, 0] })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
