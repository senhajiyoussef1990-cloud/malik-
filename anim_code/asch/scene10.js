// SCÈNE 10 — TV. 
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => salleAsch(cc, t, { rep: 7, allie: 2, vraie: u > .5 ? 'C' : 'A', doute: u > .5 ? 0 : 1, derriere: (c2) => dessine(c2, CHERCHEUR(t, 980, { face: -1, look: [-.6, 0] })) })), XB = ((cc, t, u) => salleAsch(cc, t, { rep: 7, allie: 2, vraie: 'C', derriere: (c2) => dessine(c2, CHERCHEUR(t, 980, { face: -1, look: [-.6, 0] })) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
