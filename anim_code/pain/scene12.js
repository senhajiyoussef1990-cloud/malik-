// SCÈNE 12 — Plans 22-23 (TV). s12a : le grand magasin, paisible ; un panneau « RIEN D’ILLÉGAL… mais à savoir ».
// s12b : deux paniers : VENTRE VIDE (débordant) / APRÈS LE REPAS (léger), coché.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) { grandMagasinNB(cc, t, { four: 1, odeur: 1 }); const v = ease(seg(la, .3, 1)); cc.save(); cc.globalAlpha = v; cc.translate(700, 650); cc.rotate(-.04); F(cc, poly([[-250, -60], [250, -60], [250, 60], [-250, 60]]), GRIS.blanc, 5); cc.font = 'bold 30px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('RIEN D’ILLÉGAL…', 0, -8); cc.font = 'italic bold 26px Georgia'; cc.fillText('mais mieux vaut le savoir', 0, 30); cc.restore(); } else ventreVide(cc, t, seg(lb, .2, B[1])); });
  debutFlash(c, t);
}
