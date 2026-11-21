// SCÈNE 09 — Plans 16-17 (TV). s09a : au magasin des années cinquante, le rayon « PETIT-DÉJEUNER » déborde de boîtes à mascottes, étoiles « JOUET » et bandeaux « SUCRÉ ! ».
// s09b : le vendeur, devant le rayon, ouvre une boîte et en sort un petit jouet ; deux enfants tirent leur mère par la manche : « Avec un jouet dans chaque boîte, les enfants les réclament ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 380, 1.1]]); rayonNB(cc, t, {}); }
    else {
      cam(cc, t, [[B[0], 540, 460, 1.12], [DUREE, 540, 460, 1.16]]);
      const V = voix(FRERE(t, 380, { face: 1, look: [.6, .3], sourire: 1.2, chapeau: false, handR: [150, -640], poseR: 'poing' }), ['s09b'], t);
      const Mr = MERE(t, 760, { face: -1, look: [-.7, .4], froncer: .3 }), E1 = ENFANT(t, 640, 2, { face: 1, handR: [140, -620], poseR: 'pointe' }), E2 = ENFANT(t, 880, 4, { face: -1, handL: [-140, -560], poseL: 'poing' });
      E1.bob += Math.abs(Math.sin(t * 8)) * 8; E2.bob += Math.abs(Math.sin(t * 8 + 1)) * 8;
      rayonNB(cc, t, { derriere: (c2) => { dessine(c2, V, drawVendeur); dessine(c2, Mr); dessine(c2, E1); dessine(c2, E2); } });
      const h = mainF(V, 1); etoile(cc, h[0] + 6, h[1] - 20, 16);
    }
  });
  debutFlash(c, t);
}
