// SCÈNE 09 — Plans 16-17 (TV). s09a : les rotatives tournent, la une arrive en tournoyant : « DES JEUNES FEMMES ALLUMENT LEURS « TORCHES DE LA LIBERTÉ » », avec la photo des trois fumeuses.
// s09b : devant le kiosque, une passante lit le journal, se redresse et sort une cigarette : « Moi aussi, je veux être libre ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 405, 1.0]]); cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12 + t * .3; cc.fillStyle = k % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,0)'; cc.beginPath(); cc.moveTo(540, 405); cc.arc(540, 405, 900, a, a + Math.PI / 12); cc.fill(); }
      for (let k = 0; k < 3; k++) { const v = ease(seg(la, k * .35, k * .35 + .9)); if (v > 0) uneTorches(cc, 280 + k * 260, 420, (.2 + .5 * v) * (k === 1 ? 1.15 : .85), { rot: (1 - v) * 8 + (k - 1) * .08 }); }
    } else {
      cam(cc, t, [[B[0], 560, 430, 1.2], [DUREE, 560, 420, 1.28]]);
      const Pa = voix(figurant(t, 560, 1, { s: .5, y: 790, face: 1, look: [.2, .7], chapeau: CLOCHE(2) }), ['s09b'], t);
      if (lb > B[1] * .4) { Pa.look = [.3, -.3]; Pa.sourire = 1.1; Pa.handL = [-60, -680]; Pa.poseL = 'poing'; Pa.tilt -= .05; } else { Pa.handL = [-60, -520]; Pa.handR = [60, -520]; Pa.poseL = Pa.poseR = 'poing'; }
      avenueNB(cc, t, { foule: 4, derriere: (c2) => { F(c2, poly([[160, 640], [400, 640], [400, 420], [160, 420]]), GRIS.fonce, 4); F(c2, poly([[140, 420], [420, 420], [400, 380], [160, 380]]), GRIS.noir, 3); for (let k = 0; k < 4; k++) uneTorches(c2, 190 + k * 60, 520, .14, { rot: (k - 1.5) * .05 }); dessine(c2, Pa); } });
      if (lb <= B[1] * .4) { const a = mainF(Pa, -1), b = mainF(Pa, 1); uneTorches(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 30, .22, {}); } else { const h = mainF(Pa, -1); cigaretteNB(cc, h[0], h[1] - 8, .55, -2.2, 0); }
    }
  });
  debutFlash(c, t);
}
