// SCÈNE 06 — TV. 
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { villagePluie(cc, t, { derriere: (c2) => dessine(c2, ETRANGER(t, 1000, {})) }); doigts(cc, t, 2 + Math.floor(u * 3)); }), XB = ((cc, t, u) => villagePluie(cc, t, { derriere: (c2) => { dessine(c2, ETRANGER(t, 1000, {})); dessine(c2, MAIRE(t, 580, { y: 400, s: .3, face: 1, look: [-.6, .2], sourire: .6 })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
