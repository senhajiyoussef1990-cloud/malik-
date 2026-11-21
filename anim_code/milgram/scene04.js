// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => laboMilgram(cc, t, { derriere: (c2) => dessine(c2, CHERCHEUR(t, 560, { y: 760, face: -1, look: [-.6, 0], sourire: .4 })) })), XB = ((cc, t, u) => laboMilgram(cc, t, { n: Math.floor(u * 4), cri: u * .3, derriere: (c2) => { dessine(c2, CHERCHEUR(t, 560, { y: 760, face: -1, look: [-.6, 0] })); dessine(c2, PARTICIPANT(t, 300, { y: 760, face: 1, look: [.6, .3], froncer: .6, sourcil: .8, handR: [120, -440], poseR: 'pointe' })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
