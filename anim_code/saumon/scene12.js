// SCÈNE 12 — Plans 22-23 (TV). s12a : la courbe du saumon dans les sushis grimpe de 1985 à 2000.
// s12b : le calendrier tourne de 1986 à aujourd'hui ; devant, le même plateau de sushis au saumon.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); courbeSushi(cc, t, seg(la, .1, A[1])); }
    else {
      cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 430, 1.06]]);
      cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); const u = seg(lb, .2, B[1] * .85), an = Math.round(1986 + 39 * ease(u));
      for (let k = 0; k < 3; k++) { const f = (lb * 6 + k / 3) % 1; if (u < 1) { cc.save(); cc.translate(540, 200); cc.rotate(-f * 1.4); cc.globalAlpha = 1 - f; F(cc, poly([[-90, 0], [90, 0], [90, 200], [-90, 200]]), GRIS.blanc, 2); cc.restore(); } }
      calendrier(cc, 540, 320, 1.5, an, an >= 2025 ? 'AUJOURD’HUI' : 'AVRIL');
      F(cc, poly([[220, 620], [860, 620], [880, 700], [200, 700]]), GRIS.fonce, 4); for (let k = 0; k < 4; k++) nigiriNB(cc, 390 + k * 100, 630, .9);
    }
  });
  debutFlash(c, t);
}
