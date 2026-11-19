// SCÈNE 11 — les décorations disparaissent : trois pots identiques. Narrateur s11a, client s11b (« Attendez… c'est la même chose ? »).
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const l = local('s11a', t), D = L.s11a[1], nu = ease(seg(l, D * .25, D * .85)), lb = local('s11b', t);
    cam(cc, t, [[0, 540, 405, 1.04], [L.s11a[0] + D * .3, 540, 450, 1.2], [L.s11b[0] - .3, 780, 400, 1.24], [DUREE, 620, 410, 1.1]]);
    magasinNB(cc, t);
    cc.fillStyle = `rgba(0,0,0,${.2 * (1 - nu)})`; cc.fillRect(0, 0, W, H);
    comptoirNB(cc, 260, 820, 560);
    [[400, 0], [540, 1], [680, 0]].forEach(([x, luxe]) => { if (luxe && nu < 1) { cc.save(); cc.globalAlpha = 1 - nu; pot(cc, x, 560, .9, 'luxe', t); cc.restore(); cc.save(); cc.globalAlpha = nu; pot(cc, x, 560, .9, 'simple', t); cc.restore(); } else pot(cc, x, 560, .9, 'simple', t); });
    if (nu > .9) for (const x of [400, 540, 680]) { cc.save(); cc.font = 'bold 34px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#fff'; cc.strokeStyle = '#000'; cc.lineWidth = 4; cc.strokeText('=', x + 70, 520); cc.fillText('=', x + 70, 520); cc.restore(); }
    const V = vendeurBase(t, 160); V.sourire = nu > .5 ? .3 : 1; V.sourcil = nu; V.look = [.8, 0]; V.handR = [70, -560]; V.poseR = 'poing'; if (nu > .6) { V.tilt = .1; V.handL = [-40, -700]; V.poseL = 'repos'; } dessine(cc, V, drawVendeur);   // sourire gêné, main sur la nuque
    const C = clientBase(t, 900);
    if (lb >= 0) { voix(C, ['s11b'], t); C.handR = [30, -760]; C.poseR = 'poing'; C.look = [-1, .3]; C.tilt = .1; C.sourcil = 1; }    // il se gratte la tête
    dessine(cc, C, drawClient);
    if (lb >= 0) { cc.save(); cc.font = 'bold 64px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#fff'; cc.strokeStyle = '#000'; cc.lineWidth = 6; const qy = 260 + 8 * Math.sin(t * 6); cc.strokeText('?', 950, qy); cc.fillText('?', 950, qy); cc.restore(); }
  });
  debutFlash(c, t);
}
