// SCÈNE 10 — TV. 
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); for (let k = 0; k < Math.floor(u * 24) + 1; k++) { cc.save(); cc.translate(80 + (k % 8) * 130, 120 + Math.floor(k / 8) * 230); cc.rotate((hash(k) - .5) * .2); F(cc, poly([[-56, -70], [56, -70], [56, 70], [-56, 70]]), GRIS.blanc, 2); cc.font = 'bold 14px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('★★★★★', 0, -30); cc.font = 'italic 12px Georgia'; cc.fillText('parfait !', 0, 0); cc.restore(); } }), XB = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.save(); cc.translate(400, 420); F(cc, poly([[-240, -320], [240, -320], [240, 320], [-240, 320]]), GRIS.blanc, 5); cc.font = 'bold 38px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LA LOI', 0, -240); cc.font = 'italic 24px Georgia'; cc.fillText('Faux avis : interdits', 0, -190); for (let k = 0; k < 8; k++) { ink(cc, 2, 'rgba(0,0,0,.25)'); cc.beginPath(); cc.moveTo(-200, -120 + k * 34); cc.lineTo(200, -120 + k * 34); cc.stroke(); } cc.restore(); if (u > .4) { cc.save(); cc.translate(800, 380); cc.rotate(-.2); ink(cc, 8, GRIS.noir); cc.beginPath(); cc.arc(0, 0, 110, 0, 7); cc.stroke(); cc.font = 'bold 36px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('INTERDIT', 0, 12); cc.restore(); } });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
