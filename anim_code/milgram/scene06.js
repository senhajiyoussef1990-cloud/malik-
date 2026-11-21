// SCÈNE 06 — TV. 
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => laboMilgram(cc, t, { n: 6 + Math.floor(u * 3), cri: .5 + u * .3, derriere: (c2) => { dessine(c2, CHERCHEUR(t, 560, { y: 760, face: -1, look: [-.6, 0] })); dessine(c2, PARTICIPANT(t, 300, { y: 760, face: 1, look: [.9, -.2], froncer: .8, sourcil: 1 })); } })), XB = ((cc, t, u) => laboMilgram(cc, t, { n: 9 + Math.floor(u * 3), cri: .9, derriere: (c2) => { dessine(c2, CHERCHEUR(t, 560, { y: 760, face: -1, look: [-.6, 0] })); const P = PARTICIPANT(t, 300, { y: 760, face: 1, look: [.6, -.5], froncer: 1, sourcil: 1, handL: [-60, -700], poseL: 'ouverte' }); P.bob += Math.sin(t * 20) * 2; dessine(c2, P); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
