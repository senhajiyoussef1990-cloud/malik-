// SCÈNE 05 — TV. 
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => laboMilgram(cc, t, { n: 5, cri: .4, derriere: (c2) => { dessine(c2, voix(CHERCHEUR(t, 560, { y: 760, face: -1, look: [-.6, .1], handR: [-60, -560], poseR: 'ouverte' }), ['s05a', 's09b'], t)); dessine(c2, PARTICIPANT(t, 300, { y: 760, face: 1, look: [.6, .3], froncer: .6, sourcil: .8, handR: [120, -440], poseR: 'pointe' })); } })), XB = ((cc, t, u) => { laboMilgram(cc, t, { n: 5, eleve: 1 }); cc.save(); cc.globalAlpha = ease(seg(u, .3, .7)); F(cc, poly([[760, 200], [1060, 200], [1060, 280], [760, 280]]), GRIS.blanc, 3); cc.font = 'bold 24px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('un acteur !', 910, 236); cc.font = 'italic 20px Georgia'; cc.fillText('décharges fausses', 910, 264); cc.restore(); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
