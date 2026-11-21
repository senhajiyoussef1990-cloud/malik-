// SCÈNE 05 — Plans 08-09 (TV). s05a : le médecin, index levé devant ses patients : « Pas de viande, pas d'épices. Des flocons, et du lait ! »
// s05b : derrière lui, son frère, en costume et chapeau melon, regarde les sacs de flocons… et dessine des signes de dollars dans son carnet.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 460, 420, 1.2], [B[0], 640, 420, 1.2]]);
    const D = voix(MEDECIN(t, 380, { face: 1, look: [.5, .1] }), ['s05a'], t);
    if (la >= 0 && lb < 0) { D.handR = [60, -780]; D.poseR = 'pointe'; D.froncer = .5; }
    const F2 = FRERE(t, 760, { face: -1, look: [-.4, .6], sourire: lb >= 0 ? 1.2 : .3, handL: [-60, -560], handR: [40, -560], poseL: 'poing', poseR: 'pointe' });
    cuisineFloconsNB(cc, t, { derriere: (c2) => { dessine(c2, D); dessine(c2, F2, drawVendeur); } });
    for (let k = 0; k < 3; k++) { const x = 900 + k * 60; F(cc, smooth([[x - 30, 640], [x - 26, 560], [x - 18, 540], [x + 18, 540], [x + 26, 560], [x + 30, 640]]), GRIS.blanc, 3); cc.font = 'bold 11px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('FLOCONS', x, 600); }
    if (lb >= 0) { const h = mainF(F2, -1); F(cc, poly([[h[0] - 30, h[1] - 40], [h[0] + 30, h[1] - 40], [h[0] + 30, h[1] + 30], [h[0] - 30, h[1] + 30]]), GRIS.blanc, 2); const n = Math.floor(seg(lb, .3, B[1]) * 4); cc.font = 'bold 22px Georgia'; cc.fillStyle = GRIS.noir; cc.fillText('$'.repeat(n), h[0], h[1]); }
  });
  debutFlash(c, t);
}
