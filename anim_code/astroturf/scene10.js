// SCÈNE 10 — TV. 
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); ['faux comptes', 'pétitions financées', 'associations prête-noms'].forEach((m, k) => { if (u * 3 > k) { F(cc, poly([[240, 160 + k * 200], [840, 160 + k * 200], [840, 280 + k * 200], [240, 280 + k * 200]]), GRIS.blanc, 4); cc.font = 'bold 40px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText(m, 540, 234 + k * 200); } }); }), XB = ((cc, t, u) => rueUsine(cc, t, { derriere: (c2) => manifestants(c2, t, 5, { dx: 120 }) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
