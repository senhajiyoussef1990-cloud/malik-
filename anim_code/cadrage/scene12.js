// SCÈNE 12 — Plans 21-22 (TV + héros). Le mouton écrit « nuance » dans son carnet et le souligne : « Alors je peux accueillir plusieurs faits ensemble. »
// Le renard fait glisser le cache d'une photo tronquée : le hors-champ réapparaît. « Le cadre organise une histoire. Il ne la résume pas. »
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0], R = voix(renardBase(t), ['s12b'], t), M = voix(moutonBase(t), ['s12a'], t);
  R.x = 230; R.y = 800; R.s = .5; M.x = 860; M.y = 810; M.s = .47; R.look = [.8, .2]; M.look = [-.3, .7];
  M.handL = [-60, -520]; M.handR = [40 + Math.sin(t * 14) * 6 * (la < A[1]), -540]; M.poseL = 'ouverte'; M.poseR = 'poing';
  const cache = ease(seg(lb, .3, B[1] * .8));
  if (lb >= 0) { R.handR = [lerp(280, 520, cache), -560]; R.poseR = 'ouverte'; R.lean = .06; M.look = [-.9, .1]; }
  nbEtCouleur(c, t, [[0, 540, 430, 1.05]], (cc) => {
    cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H);
    const [sx, sy, sw, sh] = CADRES.large; cc.save(); cc.translate(540, 360); F(cc, poly([[-300, -200], [300, -200], [300, 200], [-300, 200]]), '#f6f4ee', 3); cc.drawImage(vuePlace(), -290, -190, 580, 380);
    F(cc, poly([[-290 + cache * 290, -190], [290, -190], [290, 190], [-290 + cache * 290, 190]]), 'rgba(0,0,0,0)', 0);
    cc.fillStyle = GRIS.noir; cc.fillRect(-290 + 200 + cache * 380, -190, Math.max(0, 380 - cache * 380), 380); cc.fillRect(-290, -190, Math.max(0, 200 - cache * 200), 380);   // le cache qui s'ouvre
    cc.restore();
  }, (cc) => {
    for (const P of [R, M]) { cc.save(); cc.translate(0, -P.bob); (P === R ? drawRenard : drawMouton)(cc, P); cc.restore(); }
    const a = mainScene(M, -1), b = mainScene(M, 1); carnet(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 30, .56, [['nuance', seg(la, .3, A[1])]], 1, .05);
    if (la > A[1]) { ink(cc, 3, '#1a3a7a'); cc.beginPath(); const mx = (a[0] + b[0]) / 2 - 28; cc.moveTo(mx - 40, (a[1] + b[1]) / 2 - 36); cc.lineTo(mx - 40 + 50 * seg(la, A[1], A[1] + .3), (a[1] + b[1]) / 2 - 36); cc.stroke(); }
  });
  debutFlash(c, t);
}
