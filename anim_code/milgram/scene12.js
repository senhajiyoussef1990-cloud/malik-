// SCÈNE 12 — TV. 
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => laboMilgram(cc, t, { n: 4, derriere: (c2) => { dessine(c2, CHERCHEUR(t, 560, { y: 760, face: -1, look: [-.6, 0], froncer: .3 })); dessine(c2, PARTICIPANT(t, 300, { y: 760, face: 1, look: [.6, -.2], handR: [140, -600], poseR: 'ouverte', sourcil: .4 })); } })), XB = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.fillStyle = '#9a968e'; cc.fillRect(0, 640, W, H - 640); dessine(cc, PARTICIPANT(t, 380, { face: 1, look: [.6, -.2], handR: [160, -620], poseR: 'ouverte' })); dessine(cc, CHERCHEUR(t, 700, { face: -1, look: [-.6, 0], sourcil: .6 })); F(cc, ell(430, 260, 110, 50), GRIS.blanc, 3); cc.font = 'bold 40px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; if (u > .2) cc.fillText('NON.', 430, 274); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
