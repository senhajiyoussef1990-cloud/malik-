// SCÈNE 10 — Plans 18-19 (TV). s10a : dans le hall de la gare, les affiches « BUVEZ UNE ORANGE ! » apparaissent les unes après les autres.
// s10b : la mère, un verre de jus à la main, sourit à la caméra : « Un verre chaque matin, et mes enfants seront en pleine forme ! »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.06]]); gareNB(cc, t, seg(la, .1, A[1])); for (let k = 0; k < 3; k++) { const P = marche(figurant(t, ((t * 90 + k * 380) % 1300) - 110, k + 2, { face: 1, s: .44, y: 790 }), t, 8); dessine(cc, P); } }
    else {
      cam(cc, t, [[B[0], 720, 420, 1.35], [DUREE, 730, 410, 1.4]]);
      const Mr = voix(MERE(t, 760, { face: -1, look: [-.2, 0], sourire: 1.2, handR: [-120, -620], poseR: 'poing' }), ['s10b'], t);
      cuisineNB(cc, t, { menu: 'leger', annee: 1925, mere: Mr, dessus: (c2) => { for (let k = 0; k < 3; k++) verreNB(c2, 470 + k * 120, 610, .55, 1); } });
      const m = mainF(Mr, 1); verreNB(cc, m[0], m[1] + 20, .6, 1);
    }
  });
  debutFlash(c, t);
}
