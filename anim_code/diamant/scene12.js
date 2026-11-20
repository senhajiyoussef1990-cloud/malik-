// SCÈNE 12 — Plans 22-23 (TV). s12a : le coffre plein à craquer… et le comptoir de rachat qui n'offre presque rien.
// s12b : le calendrier tourne de 1947 à aujourd'hui ; devant, le même écrin ouvert.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { if (la < A[1] * .45) { cam(cc, t, [[0, 700, 400, 1.2]]); coffreNB(cc, t, { mines: 1 }); } else { cam(cc, t, [[0, 540, 440, 1.12]]); rachatNB(cc, t, 1); } }
    else {
      cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 430, 1.06]]);
      cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); const u = seg(lb, .2, B[1] * .85), an = Math.round(1947 + 78 * ease(u));
      for (let k = 0; k < 3; k++) { const f = (lb * 6 + k / 3) % 1; if (u < 1) { cc.save(); cc.translate(540, 200); cc.rotate(-f * 1.4); cc.globalAlpha = 1 - f; F(cc, poly([[-90, 0], [90, 0], [90, 200], [-90, 200]]), GRIS.blanc, 2); cc.restore(); } }
      calendrier(cc, 540, 320, 1.5, an, an >= 2025 ? 'AUJOURD’HUI' : 'AVRIL');
      F(cc, poly([[220, 620], [860, 620], [880, 700], [200, 700]]), GRIS.fonce, 4); F(cc, poly([[480, 640], [600, 640], [596, 600], [484, 600]]), GRIS.fonce, 2.5); bagueNB(cc, 540, 580, 1.2, t);
    }
  });
  debutFlash(c, t);
}
