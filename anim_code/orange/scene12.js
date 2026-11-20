// SCÈNE 12 — Plans 22-23 (TV). s12a : le calendrier tourne de 1910 à aujourd'hui ; devant, la même orange et le même verre.
// s12b : carton : le fruit (sucre + fibres) face au verre de jus — les morceaux de sucre s'empilent.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 430, 1.06]]);
      cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); const u = seg(la, .2, A[1] * .85), an = Math.round(1910 + 115 * ease(u));
      for (let k = 0; k < 3; k++) { const f = (la * 6 + k / 3) % 1; if (u < 1) { cc.save(); cc.translate(540, 200); cc.rotate(-f * 1.4); cc.globalAlpha = 1 - f; F(cc, poly([[-90, 0], [90, 0], [90, 200], [-90, 200]]), GRIS.blanc, 2); cc.restore(); } }
      calendrier(cc, 540, 320, 1.5, an, an >= 2025 ? 'AUJOURD’HUI' : 'AVRIL');
      F(cc, poly([[220, 620], [860, 620], [880, 700], [200, 700]]), GRIS.fonce, 4); orangeNB(cc, 440, 600, 50); verreNB(cc, 640, 640, 1, 1);
    } else { cam(cc, t, [[B[0], 540, 405, 1.0]]); sucreNB(cc, t, seg(lb, .3, B[1] * .8)); }
  });
  debutFlash(c, t);
}
