// SCÈNE 05 — Plans 08-09 (TV). s05a : le vendeur du club, au micro, devant une pile de disques : « Douze disques pour un centime ! Qui pourrait refuser ? »
// s05b : une loupe glisse sur le bas du coupon : « vous vous engagez à recevoir UN DISQUE PAR MOIS sauf refus écrit ».
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.08]]); cc.fillStyle = '#d4d0c6'; cc.fillRect(0, 0, W, 620); cc.fillStyle = '#7a766e'; cc.fillRect(0, 620, W, H - 620); F(cc, poly([[200, 40], [880, 40], [880, 130], [200, 130]]), GRIS.noir, 4); cc.font = 'bold 40px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.fillText('LE CLUB DU DISQUE', 540, 100); for (let k = 0; k < 10; k++) disqueNB(cc, 720 + (k % 3) * 70, 600 - Math.floor(k / 3) * 70, .55, (k % 2 - .5) * .2); const P = voix(VENDEUR(t, 400, { face: 1, look: [.5, -.2], sourire: 1.2, handR: [190, -640], poseR: 'ouverte' }), ['s05a'], t); dessine(cc, P, drawVendeur); ink(cc, 6, GRIS.fonce); cc.beginPath(); cc.moveTo(300, 790); cc.lineTo(300, 420); cc.stroke(); F(cc, ell(300, 410, 18, 26), GRIS.fonce, 3); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 560, 1.15]]); clubDisques(cc, t, 1, { loupe: seg(lb, .2, .9) }); }
  });
  debutFlash(c, t);
}
