// SCÈNE 05 — TV. 
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => villagePluie(cc, t, { derriere: (c2) => { dessine(c2, ETRANGER(t, 1000, {})); dessine(c2, voix(MAIRE(t, 580, { y: 400, s: .3, face: 1, look: [.8, .2], froncer: .6, handR: [180, -640], poseR: 'pointe' }), ['s05a', 's09b'], t)); } })), XB = ((cc, t, u) => villagePluie(cc, t, { derriere: (c2) => { dessine(c2, ETRANGER(t, 1000, {})); for (let k = 0; k < 3; k++) dessine(c2, figurant(t, 160 + k * 150, k, { s: .46, y: 800, face: 1, look: [.3, -.6], froncer: .7, sourcil: 1 })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
