// SCÈNE 07 — Plan 12 (TV). « L'imagination remplit les blancs. » Un garçon dessine un monstre dans l'ombre de l'entrepôt ; le crayon ajoute de grandes dents.
const A = L.s07a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const u = seg(t, .1, DUREE - .3);
    cam(cc, t, [[0, 540, 405, 1.0], [DUREE, 540, 420, 1.12]]);
    cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); ink(cc, 2, 'rgba(0,0,0,.25)'); for (let y = 0; y < H; y += 30) { cc.beginPath(); cc.moveTo(0, y); cc.lineTo(W, y); cc.stroke(); }   // la table
    cc.save(); cc.translate(540, 400); cc.rotate(-.04); F(cc, poly([[-330, -250], [330, -250], [330, 250], [-330, 250]]), GRIS.blanc, 4);
    cc.font = 'bold 26px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText("L'ENTREPÔT", 0, 210);
    F(cc, poly([[-200, 180], [200, 180], [200, 40], [-200, 40]]), 'rgba(0,0,0,.1)', 2);
    dessinMonstre(cc, 0, -20, 1.3, u); cc.restore();
    // la main du garçon et son crayon qui suit le dessin
    const a = u * 14, hx = 540 + Math.cos(a) * 140 * (1 - u * .3), hy = 360 + Math.sin(a * 1.3) * 90;
    cc.save(); cc.translate(hx, hy); cc.rotate(.6); F(cc, poly([[-7, 0], [7, 0], [7, -120], [-7, -120]]), GRIS.moyen, 2); F(cc, poly([[-7, 0], [7, 0], [0, 22]]), GRIS.clair, 2); cc.restore();
    gant(cc, hx + 60, hy - 70, -.9, 2.2, 'poing');
  });
  debutFlash(c, t);
}
