// SCÈNE 06 — Plans 10-11 (TV). s06a : gros plan sur le contrat « ACCORD — Aucune ampoule ne dépassera 1 000 HEURES » ; les plumes signent l'une après l'autre.
// s06b : une plaque de bronze descend au-dessus de la table : « CARTEL PHŒBUS » ; les industriels lèvent leurs verres.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 430, 1.06]]); cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); contrat(cc, 540, 420, 1.45, seg(la, .3, A[1] + .4)); const n = Math.floor(seg(la, .3, A[1] + .4) * 6), sx = 540 + (-120 + (n % 3) * 120) * 1.45, sy = 420 + (140 + Math.floor(n / 3) * 50) * 1.45; cc.save(); cc.translate(sx + Math.sin(t * 14) * 10, sy - 30); cc.rotate(.6); F(cc, poly([[-5, 0], [5, 0], [4, -110], [-4, -110]]), GRIS.noir, 1.5); F(cc, poly([[-5, 0], [5, 0], [0, 18]]), GRIS.clair, 1); cc.restore(); }
    else {
      cam(cc, t, [[B[0], 540, 420, 1.05], [DUREE, 540, 430, 1.1]]);
      const P = [[180, 1], [340, 2], [540, 0], [740, 3], [900, 1]].map(([x, k]) => INDUSTRIEL(t, x, k, { s: .46, face: x < 540 ? 1 : -1, look: [0, -.4], sourire: 1, handR: [60, -700], poseR: 'poing' }));
      geneveNB(cc, t, { plaque: seg(lb, 0, .8), derriere: (c2) => P.forEach(p => dessine(c2, p)) });
      P.forEach(p => { const h = mainF(p, 1); F(cc, smooth([[h[0] - 10, h[1] - 30], [h[0] + 10, h[1] - 30], [h[0] + 4, h[1] - 6], [h[0] - 4, h[1] - 6]]), 'rgba(255,255,255,.5)', 1.5); ink(cc, 2, GRIS.noir); cc.beginPath(); cc.moveTo(h[0], h[1] - 6); cc.lineTo(h[0], h[1] + 8); cc.stroke(); });
    }
  });
  debutFlash(c, t);
}
