// SCÈNE 09 — TV. 
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.fillStyle = '#9a968e'; cc.fillRect(0, 640, W, H - 640); for (let k = 0; k < 5; k++) dessine(cc, PARTICIPANT(t, 140 + k * 200, { v: k, face: 1, look: [0, .2], sourire: .5 })); cc.font = 'italic bold 34px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; if (u > .3) cc.fillText('des gens ordinaires', 540, 110); }), XB = ((cc, t, u) => laboMilgram(cc, t, { n: 12, cri: .8, derriere: (c2) => { dessine(c2, voix(CHERCHEUR(t, 560, { y: 760, face: -1, look: [-.6, .1], handR: [-60, -560], poseR: 'ouverte' }), ['s05a', 's09b'], t)); dessine(c2, PARTICIPANT(t, 300, { y: 760, face: 1, look: [.6, .3], froncer: .6, sourcil: .8, handR: [120, -440], poseR: 'pointe' })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
