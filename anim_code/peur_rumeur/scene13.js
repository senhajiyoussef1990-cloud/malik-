// SCÈNE 13 — Plans 23-24 (TV + héros). Les habitants réparent la charnière et rient doucement de leur emballement.
// Le renard au veilleur, avec respect : « Tu avais entendu juste. L'explication était incertaine. »
const A = L.s13a, B = L.s13b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0], R = voix(renardBase(t), ['s13b'], t), M = moutonBase(t);
  R.x = 360; R.y = 790; R.s = .5; M.x = 200; M.y = 800; M.s = .47; R.look = [.9, 0]; M.look = [.9, 0]; M.sourire = 1;
  if (lb >= 0) { R.handR = [200, -600]; R.poseR = 'ouverte'; R.lid = .5; R.sourire = .9; R.sourcil = .4; }
  const keys = [[0, 560, 460, 1.35], [B[0], 520, 450, 1.2], [DUREE, 540, 450, 1.25]];
  nbEtCouleur(c, t, keys, (cc) => {
    ruelleNB(cc, t, { nuit: .35, porte: .3, charniere: la > A[1] * .6 });
    const Ar = figurant(t, 520, 0, { s: .46, y: 600, tablier: 'noir', chapeau: COIFFE.casquette, face: -1, look: [.8, -.3], lean: .08, handR: [80 + Math.sin(t * 10) * 10, -640], poseR: 'poing' }); dessine(cc, Ar);   // l'artisan fixe la vis
    for (let k = 0; k < 3; k++) { const P = figurant(t, 760 + k * 80, k + 1, { s: .44, y: 680 + k * 20, face: -1, look: [.6, 0], rire: (Math.floor(t * 3) + k) % 2 ? 1 : 0, sourire: 1.3 }); P.chapeau = [COIFFE.foulard, COIFFE.toque, COIFFE.casquette][k]; P.bob += Math.abs(Math.sin(t * 8 + k)) * 4; dessine(cc, P); }
    const V = VEILLEUR(t, 650, { y: 760, face: -1, look: [.8, 0], sourire: lb >= 0 ? 1 : .2 }); if (lb > B[1] * .5) { V.tilt = Math.sin(lb * 6) * .06; } dessine(cc, V);
  }, (cc) => { for (const P of [M, R]) { cc.save(); cc.translate(0, -P.bob); (P === R ? drawRenard : drawMouton)(cc, P); cc.restore(); } });
  debutFlash(c, t);
}
