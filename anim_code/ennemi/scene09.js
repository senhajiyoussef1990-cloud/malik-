// SCÈNE 09 — TV. 
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.font = 'bold 40px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('UN ENNEMI COMMUN', 540, 120); for (let k = 0; k < 9; k++) { const a = k * .7 - 2.8, r = 300 - clamp(u) * 140; dessine(cc, figurant(t, 540 + Math.sin(a) * r, k % 5, { s: .34, y: 700, face: Math.sin(a) > 0 ? -1 : 1, look: [0, -.3], froncer: .4 })); } }), XB = ((cc, t, u) => unis(cc, t, u, { parle: ['s09b'], nuit: .3 }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
