// SCÈNE 06 — Plans 10-11 (TV). s06a : sur l'étal, une loupe géante survole un saumon cru : de petits points (parasites) apparaissent ; les clients font la grimace.
// s06b : la cheffe d'un bar à sushis croise les bras : « Du saumon cru dans un sushi ? Jamais de la vie ! »
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 420, 480, 1.4], [B[0], 420, 470, 1.45]]);
      const C1 = figurant(t, 480, 2, { face: -1, s: .5, y: 790, look: [-.4, .7], froncer: .8 }), C2 = CLIENTE(t, 640, { face: -1, look: [-.6, .6], froncer: .6 });
      if (la > A[1] * .4) { C1.recule = 1; C1.tilt -= .08; C2.tilt -= .06; C2.handL = [-40, -640]; C2.poseL = 'ouverte'; }
      marcheNB(cc, t, { derriere: (c2) => { dessine(c2, C1); dessine(c2, C2); } });
      const u = seg(la, .2, A[1]), lx = lerp(160, 340, u); cc.save(); cc.translate(lx, 520); ink(cc, 8, GRIS.fonce); cc.beginPath(); cc.moveTo(30, 30); cc.lineTo(80, 90); cc.stroke(); F(cc, ell(0, 0, 44, 44), 'rgba(255,255,255,.25)', 5); cc.restore();
      cc.fillStyle = GRIS.noir; for (let k = 0; k < 12; k++) { const x = 190 + hash(k) * 150, y = 520 + hash(k + 5) * 20; if (Math.hypot(x - lx, y - 520) < 44) { cc.beginPath(); cc.arc(x, y, 3, 0, 7); cc.fill(); } }
    } else {
      cam(cc, t, [[B[0], 540, 400, 1.3], [DUREE, 540, 390, 1.36]]);
      const Ch = voix(CHEFFE(t, 540, { face: 1, look: [0, 0], handL: [60, -560], handR: [-60, -560], poseL: 'poing', poseR: 'poing', froncer: 1, sourcil: 1 }), ['s06b'], t);
      Ch.tilt += Math.sin(lb * 8) * .05 * (lb > B[1] * .5);
      barNB(cc, t, { sushis: 0, derriere: (c2) => dessine(c2, Ch) });
      for (let k = 0; k < 4; k++) nigiriNB(cc, 300 + k * 160, 596, .7);
      F(cc, ell(300, 596, 8, 8), GRIS.blanc, 0);
    }
  });
  debutFlash(c, t);
}
