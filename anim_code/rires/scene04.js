// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => studio38NB(cc, t, { derriere: (c2) => { for (const [x, f] of [[470, 1], [700, -1]]) dessine(c2, figurant(t, x, x > 600 ? 0 : 1, { s: .46, y: 790, face: f, look: [f * .6, -.2], sourire: .8, handR: [f * 60, -600], poseR: 'ouverte' })); } })), XB = ((cc, t, u) => { studio38NB(cc, t, { derriere: (c2) => dessine(c2, INGENIEUR(t, 300, { face: 1, look: [.6, .3], sourire: .6, handR: [100, -540], poseR: 'poing' })) }); machineRires(cc, 760, 790, .9, t, { on: u > .5 ? 1 : 0 }); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
