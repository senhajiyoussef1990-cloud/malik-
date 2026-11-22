// SCÈNE 05 — TV. 
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => vendeurParle(cc, t, u, ['s05a'], { texte: '– 50 % DE MALADES !', pose: 'ouverte', foule: 1 })), XB = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.font = 'bold 200px Georgia'; cc.fillText('50 %', 540, 430); cc.font = 'italic bold 32px Georgia'; cc.fillText('« la moitié du village sauvée ! »', 540, 560); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
