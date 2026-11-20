// SCÈNE 11 — Plans 20-21 (TV). La technicienne montre une mesure reproductible : « Un bon expert explique ce qu'il sait. »
// Elle pose un panneau « INCERTAIN » : « Et reconnaît aussi ce qu'il ignore. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 540, 405, 1.0]]);
    tableTechnique(cc, t, seg(la, .2, A[1]));
    const T = figurant(t, 860, 1, { s: .5, y: 790, face: -1, tablier: 'blanc', look: [.6, .2], sourire: .7 });
    if (lb >= 0) { voix(T, ['s11b'], t); T.handR = [220, -640]; T.poseR = 'poing'; }
    dessine(cc, T);
    if (lb >= 0) { const k = ease(seg(lb, 0, .4)); cc.save(); cc.translate(700, 300 - (1 - k) * 80); cc.globalAlpha = k; F(cc, poly([[-110, -36], [110, -36], [110, 36], [-110, 36]]), GRIS.blanc, 4); ink(cc, 2); cc.setLineDash([8, 6]); cc.strokeRect(-100, -28, 200, 56); cc.setLineDash([]); cc.font = 'bold 30px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('INCERTAIN', 0, 11); cc.restore(); }
  });
  debutFlash(c, t);
}
