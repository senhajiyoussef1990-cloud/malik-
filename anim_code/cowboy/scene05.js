// SCÈNE 05 — Plans 08-09 (TV). s05a : au comptoir, un fumeur moustachu repousse le paquet « Douce » : « Une cigarette pour dames ? Très peu pour moi. »
// s05b : trente ans plus tard, le graphique des ventes de la « Douce » ne cesse de baisser jusqu’en 1954.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 560, 420, 1.12]]); tabacNB(cc, t, { derriere: (c2) => { dessine(c2, voix(FUMEUR(t, 440, { face: 1, look: [.6, .3], froncer: .8, handR: [150, -560], poseR: 'ouverte', chapeau: (c3, hy) => { F(c3, ell(0, hy - 60, 64, 10), GRIS.fonce, 2); F(c3, smooth([[-36, hy - 62], [-30, hy - 96], [30, hy - 96], [36, hy - 62]]), GRIS.fonce, 2); } }), ['s05a'], t)); dessine(c2, figurant(t, 820, 0, { s: .5, y: 790, face: -1, look: [-.6, 0], tablier: 'blanc' })); } }); paquetNB(cc, 640 + seg(la, .5, 1) * 60, 560, .6, { dame: 1 }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); courbeVentes(cc, t, seg(lb, 0, B[1]), 0); }
  });
  debutFlash(c, t);
}
