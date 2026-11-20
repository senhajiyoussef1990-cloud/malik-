// SCÈNE 04 — Plans 06-07 (TV). s04a : à l'usine, les souffleurs de verre façonnent les ampoules ; au mur, le panneau « DURÉE : 2 000 h » ; les rangées d'ampoules brillent.
// s04b : dans une maison, une famille garde la même ampoule au plafond… le calendrier tourne, tourne — et le carnet de commandes du magasin reste vide.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.12], [B[0], 600, 420, 1.2]]); const S = [0, 1, 2].map(k => figurant(t, 260 + k * 260, [2, 0, 3][k], { s: .46, y: 790, face: 1, look: [0, .6], tablier: 'noir', chapeau: COIFFE.casquette, handL: [-40, -560], handR: [60, -560], poseL: 'poing', poseR: 'poing' })); usineNB(cc, t, { derriere: (c2) => S.forEach(p => dessine(c2, p)) }); S.forEach((p, k) => { const h = mainF(p, 1); ink(cc, 4, GRIS.noir); cc.beginPath(); cc.moveTo(h[0], h[1]); cc.lineTo(h[0] + 10, h[1] - 60); cc.stroke(); F(cc, ell(h[0] + 12, h[1] - 72, 16 + Math.sin(t * 3 + k) * 4, 18 + Math.sin(t * 3 + k) * 4), 'rgba(255,255,255,.7)', 2); }); }
    else {
      cam(cc, t, [[B[0], 540, 405, 1.05], [DUREE, 540, 420, 1.1]]);
      cuisineNB(cc, t, { menu: 'leger', annee: 1924 + Math.floor(seg(lb, 0, B[1]) * 4), pere: PERE(t, 360, { face: 1, look: [.2, -.8], sourire: 1 }), mere: MERE(t, 820, { face: -1, look: [-.2, -.8], sourire: 1 }) });
      ink(cc, 3, GRIS.noir); cc.beginPath(); cc.moveTo(590, 0); cc.lineTo(590, 80); cc.stroke(); ampouleNB(cc, 590, 140, .9, .9);
      F(cc, poly([[30, 470], [250, 470], [250, 600], [30, 600]]), GRIS.blanc, 3); cc.font = 'bold 18px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('COMMANDES', 140, 500); cc.font = 'italic 18px Georgia'; cc.fillText('— aucune —', 140, 550);
    }
  });
  debutFlash(c, t);
}
