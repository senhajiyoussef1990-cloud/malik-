// SCÈNE 08 — publicité sur la place, foule emballée. Narrateur s08a, vendeur s08b (« Le produit préféré de la ville ! »).
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const lb = local('s08b', t);
    cam(cc, t, [[0, 540, 405, 1.0], [L.s08a[0] + 2, 540, 420, 1.08], [L.s08b[0] - .2, 540, 300, 1.3], [DUREE, 540, 380, 1.1]]);
    rueNB(cc, t);
    F(cc, poly([[380, 470], [700, 470], [700, 520], [380, 520]]), GRIS.fonce, 5);                                    // estrade
    for (let k = 0; k < 6; k++) F(cc, poly([[380 + k * 54, 470], [434 + k * 54, 470], [407 + k * 54, 494]]), k % 2 ? GRIS.blanc : GRIS.noir, 2);
    const V = vendeurBase(t, 540); V.y = 480; V.s = .5; V.handL = [-110, -900]; V.poseL = 'poing'; V.look = [0, -.2];
    if (lb >= 0) { voix(V, ['s08b'], t); V.handR = [130, -740]; V.poseR = 'ouverte'; V.sourcil = 1; V.tilt = -.08; }
    dessine(cc, V, drawVendeur);
    const hx = 540 + (V.handL[0]) * V.s, hy = 480 + V.handL[1] * V.s - V.bob; pot(cc, hx, hy - 10, .5, 'luxe', t);     // il brandit le produit
    const ph = step(t);
    for (let k = 0; k < 9; k++) {                                                                                     // foule qui saute et agite les bras
      const x = 80 + k * 115, saut = Math.abs(Math.sin(ph * 5 + k * 1.3)) * 22;
      const P = { x, y: 840 + (k % 2) * 30, s: .42, t: ph, v: k, face: k < 4 ? 1 : -1, look: [k < 4 ? .6 : -.6, -.4], bob: saut, talk: .3 + .3 * Math.abs(Math.sin(ph * 7 + k)), sourire: 1.3,
        handL: [-80, -700 - 40 * Math.sin(ph * 6 + k)], handR: [80, -720 + 30 * Math.sin(ph * 6 + k)], poseL: 'ouverte', poseR: 'ouverte' };
      if (k % 3 === 2) P.objet = (c2, h) => pot(c2, h[0], h[1] - 20, .55, 'simple', t);
      dessine(cc, P, drawFigurant);
    }
  });
  debutFlash(c, t);
}
