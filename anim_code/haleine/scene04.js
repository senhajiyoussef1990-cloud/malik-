// SCÈNE 04 — Plans 06-07 (TV). s04a : à l'hôpital, une infirmière passe la serpillière trempée dans l'antiseptique, une autre en verse sur une plaie ; l'étiquette dit « SOLS · PLAIES ».
// s04b : à l'agence de réclame, le graphique des ventes du flacon reste désespérément plat.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.1], [B[0], 560, 420, 1.15]]); const I1 = INFIRMIERE(t, 300, { face: 1, look: [.3, .8], handL: [20, -560], handR: [100, -520], poseL: 'poing', poseR: 'poing' }), I2 = INFIRMIERE(t, 720, { face: -1, look: [-.4, .6], handR: [-130, -560], poseR: 'poing' }); hopitalNB(cc, t, { derriere: (c2) => { dessine(c2, I1); dessine(c2, I2); } }); const h = mainF(I1, 1); serpilliere(cc, h[0] + 20 + Math.sin(t * 4) * 20, 790, .3 + Math.sin(t * 4) * .15); const h2 = mainF(I2, 1); flaconNB(cc, h2[0], h2[1] + 10, .3, { rot: -1.2 }); }
    else { cam(cc, t, [[B[0], 420, 400, 1.3]]); agenceNB(cc, t, { lignes: 0, ventes: 0 }); }
  });
  debutFlash(c, t);
}
