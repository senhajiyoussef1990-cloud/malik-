// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = '#d6d2c8'; cc.fillRect(0, 0, W, 620); cc.fillStyle = '#7e7a72'; cc.fillRect(0, 620, W, H - 620); F(cc, poly([[300, 60], [780, 60], [780, 340], [300, 340]]), '#2e2e2c', 7); cc.font = 'bold 30px Georgia'; cc.textAlign = 'center'; cc.fillStyle = 'rgba(240,240,230,.9)'; cc.fillText('SUCRE ET CŒUR ?', 540, 160); cc.font = 'bold 60px Georgia'; cc.fillText('?', 540, 260); dessine(cc, SAVANT(t, 200, { face: 1, look: [.7, -.3], froncer: .6, handR: [150, -660], poseR: 'pointe' })); dessine(cc, SAVANT(t, 880, { v: 0, face: -1, look: [-.7, -.3], froncer: .4 })); }), XB = ((cc, t, u) => sucrerieNB(cc, t, { derriere: (c2) => dessine(c2, CONFISEUR(t, 300, { face: 1, look: [.6, -.2], froncer: .6, sourcil: .7, handR: [80, -620], poseR: 'poing' })) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
