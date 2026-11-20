// SCÈNE 12 — Plans 22-23 (TV). s12a : le schéma : LE VENDEUR → LE MÉDECIN → LE PUBLIC ; le vendeur s'efface dans l'ombre (« caché »).
// s12b : le calendrier tourne ses pages de 1925 à 2025 — la même assiette fume toujours devant.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.02], [B[0], 540, 405, 1.0]]); schemaNB(cc, t, seg(la, .1, A[1] * .7), ease(seg(la, A[1] * .7, A[1] * .7 + .5))); }
    else {
      cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 430, 1.08]]);
      cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); const u = seg(lb, .2, B[1] * .85), an = Math.round(1925 + 100 * ease(u));
      for (let k = 0; k < 3; k++) { const f = (lb * 6 + k / 3) % 1; if (u < 1) { cc.save(); cc.translate(540, 320 - 80 * 1.5); cc.rotate(-f * 1.4); cc.globalAlpha = 1 - f; F(cc, poly([[-90, 0], [90, 0], [90, 200], [-90, 200]]), GRIS.blanc, 2); cc.restore(); } }
      calendrier(cc, 540, 320, 1.5, an, an >= 2025 ? 'AUJOURD’HUI' : 'AVRIL');
      F(cc, poly([[220, 620], [860, 620], [880, 700], [200, 700]]), GRIS.fonce, 4);
      assietteNB(cc, 540, 640, .9, 'copieux', t); tasseNB(cc, 700, 640, .8, t);
    }
  });
  debutFlash(c, t);
}
