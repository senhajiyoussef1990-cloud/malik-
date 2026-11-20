// SCÈNE 09 — Plans 16-17 (TV). s09a : la brochure « SĀMON de Norvège » se coche : ✓ FRAIS, ✓ EAUX FROIDES, ✓ SANS PARASITES.
// s09b : dans un salon de dégustation, des chefs goûtent un sushi au saumon, hochent la tête, applaudissent.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 420, 1.05]]); cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); brochure(cc, 540, 420, 1.45, seg(la, .2, A[1])); }
    else {
      cam(cc, t, [[B[0], 540, 420, 1.1], [DUREE, 540, 410, 1.15]]);
      const goute = seg(lb, .3, 1.3);
      const Ch = [CHEFFE(t, 260, { face: 1, look: [.6, .4] }), figurant(t, 460, 3, { face: 1, s: .5, y: 790, chapeau: COIFFE.toque, tablier: 'blanc', look: [.4, .5] }), figurant(t, 680, 0, { face: -1, s: .5, y: 790, chapeau: COIFFE.toque, tablier: 'blanc', look: [-.4, .5] }), DELEGUE(t, 880, { face: -1, look: [-.8, 0], sourire: 1 })];
      if (goute >= 1) { for (let k = 0; k < 3; k++) { Ch[k].sourire = 1; Ch[k].tilt += Math.sin(t * 6 + k) * .05; Ch[k].look = [0, 0]; } if (lb > B[1] * .6) for (let k = 0; k < 3; k++) { const a = Math.abs(Math.sin(t * 10 + k)); Ch[k].handL = [-30 - a * 30, -600]; Ch[k].handR = [30 + a * 30, -600]; Ch[k].poseL = Ch[k].poseR = 'ouverte'; } }
      barNB(cc, t, { sushis: 4, derriere: (c2) => { for (let k = 0; k < 3; k++) dessine(c2, Ch[k]); dessine(c2, Ch[3], drawVendeur); } });
    }
  });
  debutFlash(c, t);
}
