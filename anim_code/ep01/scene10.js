// SCÈNE 10 — des flèches au sol guident le client jusqu'au produit. Narrateur s10a.
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const l = local('s10a', t), D = L.s10a[1], u = clamp((t - .4) / (DUREE - 1.2));
    cam(cc, t, [[0, 540, 405, 1.0], [DUREE * .5, 600, 420, 1.12], [DUREE, 760, 420, 1.22]]);
    magasinNB(cc, t);
    for (let k = 0; k < 8; k++) {                                                                                      // flèches qui clignotent l'une après l'autre
      const x = 120 + k * 100, on = Math.floor(t * 4) % 8 === k ? 1 : .35;
      cc.fillStyle = `rgba(255,255,255,${on})`; cc.beginPath(); cc.moveTo(x, 690); cc.lineTo(x + 50, 690); cc.lineTo(x + 50, 676); cc.lineTo(x + 80, 700); cc.lineTo(x + 50, 724); cc.lineTo(x + 50, 710); cc.lineTo(x, 710); cc.fill(); ink(cc, 3); cc.stroke();
    }
    for (const x of [200, 400, 600]) { F(cc, poly([[x - 6, 640], [x + 6, 640], [x + 6, 560], [x - 6, 560]]), GRIS.fonce, 3); F(cc, ell(x, 556, 12, 10), GRIS.moyen, 3); }   // poteaux à cordon
    ink(cc, 8, GRIS.noir); cc.beginPath(); cc.moveTo(200, 570); cc.quadraticCurveTo(300, 610, 400, 570); cc.quadraticCurveTo(500, 610, 600, 570); cc.stroke();
    projecteur(cc, 960, 640, .8); F(cc, poly([[910, 640], [1010, 640], [1000, 540], [920, 540]]), GRIS.blanc, 4); pot(cc, 960, 540, .8, 'luxe', t);
    const C = clientBase(t, lerp(60, 840, ease(u))); C.face = 1; C.walk = t * 7; C.bob = Math.abs(Math.sin(t * 7)) * 9; C.look = [1, .5]; C.sourire = 1.1;
    C.handL = [-100, -400 + 20 * Math.sin(t * 7)]; C.handR = [100, -400 - 20 * Math.sin(t * 7)]; dessine(cc, C, drawClient);
  });
  debutFlash(c, t);
}
