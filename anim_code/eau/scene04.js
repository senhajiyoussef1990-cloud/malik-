// SCÈNE 04 — Plans 06-07 (TV). s04a : à l’agence, le graphique monte ; le tableau : « NOTRE DÉFI : vendre ce qui coule du robinet… à prix d’or ! » (lignes 1-2).
// s04b : un robinet ordinaire, une goutte qui tombe… et l’étiquette de prix qui s’y accroche.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 600, 380, 1.1]]); agenceNB(cc, t, { lignes: 1, ventes: seg(la, 0, A[1]) > .5 ? 1 : 0, derriere: (c2) => { dessine(c2, figurant(t, 300, 0, { s: .48, y: 780, face: 1, look: [.7, -.4] })); } }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 640, 380, 1.15]]); robinetNB(cc, t); etiquette(cc, 760, 420, '× 1000', 1.3, -.15 + Math.sin(t * 2) * .05); }
  });
  debutFlash(c, t);
}
