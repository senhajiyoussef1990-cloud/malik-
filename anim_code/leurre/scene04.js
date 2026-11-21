// SCÈNE 04 — Plans 06-07 (TV). s04a : « ABONNEZ-VOUS ! » : un lecteur à lunettes feuillette le magazine dans son fauteuil.
// s04b : les trois offres apparaissent une à une : EN LIGNE 59 $ · PAPIER 125 $ · PAPIER + EN LIGNE 125 $.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 400, 1.06]]); offresNB(cc, t, -1); dessine(cc, LECTEUR(t, 540, { s: .6, y: 1000, face: 1, look: [.4, .7], handL: [-80, -520], handR: [80, -520], poseL: 'poing', poseR: 'poing' })); cc.save(); cc.translate(540, 700); cc.rotate(-.05); F(cc, poly([[-110, -80], [0, -70], [110, -80], [110, 70], [0, 80], [-110, 70]]), GRIS.blanc, 4); ink(cc, 2, GRIS.fonce); cc.beginPath(); cc.moveTo(0, -70); cc.lineTo(0, 80); cc.stroke(); cc.font = 'bold 22px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('MAGAZINE', -55, -40); for (let k = 0; k < 5; k++) { ink(cc, 2, 'rgba(0,0,0,.3)'); cc.beginPath(); cc.moveTo(-95, -10 + k * 16); cc.lineTo(-15, -10 + k * 16); cc.moveTo(15, -50 + k * 22); cc.lineTo(95, -50 + k * 22); cc.stroke(); } cc.restore(); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); offresNB(cc, t, seg(lb, 0, B[1] * .9)); }
  });
  debutFlash(c, t);
}
