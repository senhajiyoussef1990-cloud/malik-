// SCÈNE 05 — Plans 08-09 (TV). s05a : à l’entrée de son magasin, l’inventeur tend un panier : « Prenez un panier, et servez-vous ! Plus besoin d’attendre au comptoir ! »
// s05b : vu d’en haut, le plan du magasin : de l’ENTRÉE, un chemin en zigzag traverse tous les rayons jusqu’au LAIT, tout au fond.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 600, 440, 1.1]]); libreServiceNB(cc, t, { derriere: (c2) => { const P = voix(INVENTEUR(t, 700, { face: -1, look: [-.6, -.1], sourire: 1.1, handR: [-130, -560], poseR: 'poing' }), ['s05a'], t); dessine(c2, P); const h = mainF(P, 1); panierNB(c2, h[0], h[1] + 60, .7); } }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); planMagasin(cc, t, seg(lb, .2, B[1] * .95)); }
  });
  debutFlash(c, t);
}
