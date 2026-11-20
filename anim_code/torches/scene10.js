// SCÈNE 10 — Plans 18-19 (TV). s10a : le graphique des ventes du fabricant s'envole ; sur l'avenue, des femmes fument désormais tranquillement.
// s10b : derrière un rideau éclairé, en ombres chinoises : le fabricant et Bernays se serrent la main, des billets passent ; le public, devant, ne voit que le rideau.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 600, 420, 1.1]]); const Fb = FABRICANT(t, 420, { face: 1, look: [.8, -.4], sourire: 1.2, handL: [-150, -680], handR: [150, -680], poseL: 'ouverte', poseR: 'ouverte' }); bureauTabacNB(cc, t, { ventes: seg(la, .2, A[1]), derriere: (c2) => dessine(c2, Fb) }); }
    else {
      cam(cc, t, [[B[0], 540, 400, 1.05], [DUREE, 540, 390, 1.1]]);
      cc.fillStyle = GRIS.noir; cc.fillRect(0, 0, W, H); F(cc, poly([[140, 60], [940, 60], [940, 560], [140, 560]]), '#efe8d6', 4); for (let k = 0; k < 12; k++) { ink(cc, 2, 'rgba(0,0,0,.1)'); cc.beginPath(); cc.moveTo(150 + k * 66, 60); cc.quadraticCurveTo(170 + k * 66, 300, 150 + k * 66, 560); cc.stroke(); }
      cc.save(); cc.beginPath(); cc.rect(140, 60, 800, 500); cc.clip();
      const Fb = FABRICANT(t, 420, { face: 1, s: .6, y: 640, handR: [150, -560], poseR: 'ouverte' }), Bn = BERNAYS(t, 660, { face: -1, s: .56, y: 640, chapeau: true, handR: [-150, -560], poseR: 'ouverte' }); dessine(cc, Fb); dessine(cc, Bn, drawVendeur);
      const u = (lb * .8) % 1; F(cc, poly([[480 + u * 100, 400], [540 + u * 100, 400], [540 + u * 100, 380], [480 + u * 100, 380]]), GRIS.noir, 0); cc.fillStyle = 'rgba(28,24,20,.55)'; cc.fillRect(140, 60, 800, 500); cc.fillStyle = 'rgba(239,232,214,.45)'; cc.fillRect(140, 60, 800, 500); for (let k = 0; k < 12; k++) { ink(cc, 3, 'rgba(0,0,0,.18)'); cc.beginPath(); cc.moveTo(150 + k * 66, 60); cc.quadraticCurveTo(170 + k * 66, 300, 150 + k * 66, 560); cc.stroke(); } cc.restore();
      for (let k = 0; k < 8; k++) { const x = 100 + k * 125; F(cc, ell(x, 690, 36, 40), '#1a1816', 2); F(cc, smooth([[x - 60, 810], [x - 50, 720], [x + 50, 720], [x + 60, 810]]), '#1a1816', 2); }
    }
  });
  debutFlash(c, t);
}
