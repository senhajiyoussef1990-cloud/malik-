// SCÈNE 04 — Plans 06-07 (TV). s04a : à la maison de disques « DISQUES ÉTOILE », l'étagère des nouveautés déborde ; des pochettes tombent ; au studio, l'animateur n'en choisit qu'une sur la pile.
// s04b : au magasin de disques, un bac « 1 $ — INVENDUS » se remplit ; le vendeur bâille.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 820, 380, 1.4], [DUREE, 700, 400, 1.2]]); labelNB(cc, t, {}); for (let k = 0; k < 6; k++) { const u = (la * .8 + k / 6) % 1; cc.save(); cc.translate(640 + k * 62, 200 + u * 500); cc.rotate(u * 4 + k); F(cc, poly([[-20, -20], [20, -20], [20, 20], [-20, 20]]), [GRIS.blanc, GRIS.clair, GRIS.moyen][k % 3], 2); cc.restore(); } }
    else {
      cam(cc, t, [[B[0], 540, 420, 1.15], [DUREE, 540, 430, 1.2]]);
      cc.fillStyle = '#d6d2c8'; cc.fillRect(0, 0, W, 640); cc.fillStyle = '#76726a'; cc.fillRect(0, 640, W, H - 640);
      const V = figurant(t, 760, 2, { face: -1, s: .5, y: 790, look: [-.6, .5], lid: .3 }); if (Math.sin(t * 1.5) > .6) { V.talk = 1; V.lid = .1; } dessine(cc, V);
      F(cc, poly([[200, 560], [620, 560], [600, 760], [220, 760]]), GRIS.fonce, 4); F(cc, poly([[260, 470], [560, 470], [560, 530], [260, 530]]), GRIS.blanc, 3); cc.font = 'bold 28px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('INVENDUS — 1 $', 410, 512);
      const n = Math.floor(seg(lb, 0, B[1]) * 14); for (let k = 0; k < n; k++) { cc.save(); cc.translate(240 + (k % 7) * 52, 600 - Math.floor(k / 7) * 26); cc.rotate((hash(k) - .5) * .4); F(cc, poly([[-24, -24], [24, -24], [24, 24], [-24, 24]]), [GRIS.blanc, GRIS.clair, GRIS.moyen][k % 3], 2); disqueNB(cc, 8, 0, 14); cc.restore(); }
    }
  });
  debutFlash(c, t);
}
