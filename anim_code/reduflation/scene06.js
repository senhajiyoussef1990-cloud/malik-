// SCÈNE 06 — Plans 10-11 (TV). s06a : sur un calendrier qui tourne, le paquet perd encore un biscuit (14 → 13) ; l'étiquette de prix ne bouge pas.
// s06b : à l'épicerie, une cliente en foulard prend un paquet, le soupèse à peine et le pose sur le comptoir, contente : « Même prix, même paquet. Rien n'a changé ! »
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); const u = seg(la, .2, A[1]); calendrier(cc, 300, 380, 1.6, u > .5 ? 'MARS' : 'FÉVR.', 'MOIS'); paquetNB(cc, 720, 420, 1.3, { n: u > .5 ? 13 : 14, air: 1 }); if (u > .5 && u < .8) { const v = (u - .5) / .3; biscuitNB(cc, 720 + 40 * 1.3, 420 - 20 - v * 200, 20); } }
    else {
      cam(cc, t, [[B[0], 560, 420, 1.2], [DUREE, 560, 410, 1.26]]);
      const Cl = voix(CLIENTE(t, 520, { face: 1, look: [.6, .4], sourire: 1 }), ['s06b'], t);
      Cl.handR = [130, lerp(-500, -560, Math.abs(Math.sin(lb * 2)))]; Cl.poseR = 'poing';
      const Ep = figurant(t, 760, 3, { face: -1, s: .5, y: 790, look: [-.8, 0], sourire: .8, tablier: 'blanc' });
      epicerieNB(cc, t, { n: 13, derriere: (c2) => { dessine(c2, Cl); dessine(c2, Ep); } });
      const h = mainF(Cl, 1); paquetNB(cc, h[0] + 10, h[1] - 30, .32, { n: 13 });
    }
  });
  debutFlash(c, t);
}
