// SCÈNE 12 — sur la place, tout le monde tient la même boîte banale ; regards gênés. Narrateur s12a.
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const l = local('s12a', t), D = L.s12a[1], gene = ease(seg(l, D * .45, D * .7));
    cam(cc, t, [[0, 540, 405, 1.0], [L.s12a[0] + D * .5, 540, 430, 1.1], [DUREE, 540, 440, 1.16]]);
    rueNB(cc, t);
    const ph = step(t);
    for (let k = 0; k < 8; k++) {
      const x = 100 + k * 125, regard = gene > 0 ? (k % 2 ? -1 : 1) : 0;
      const P = { x, y: 790 + (k % 2) * 26, s: .5, t: ph, v: k, face: k % 2 ? -1 : 1, bob: bnc(ph, k * .2) * 3 * (1 - gene),
        look: gene > 0 ? [regard * .9, 0] : [0, .7], sourire: lerp(1, -.4, gene), sourcil: gene, tilt: gene * .08 * (k % 2 ? 1 : -1),
        handR: [60, -470], poseR: 'ouverte', handL: gene > .5 && k % 3 === 0 ? [40, -720] : [-92, -400], poseL: 'poing' };   // certains se grattent la nuque
      P.objet = (c2, h) => pot(c2, h[0], h[1] + 6, .6, 'simple', t);
      dessine(cc, P, drawFigurant);
    }
    if (gene > .3) { const a = ease(seg(l, D * .7, D)); cc.save(); cc.globalAlpha = a; cc.font = 'bold 46px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#fff'; cc.strokeStyle = '#000'; cc.lineWidth = 5;
      for (const [x, y] of [[260, 300], [540, 260], [820, 300]]) { cc.strokeText('...', x, y); cc.fillText('...', x, y); } cc.restore(); }
  });
  debutFlash(c, t);
}
