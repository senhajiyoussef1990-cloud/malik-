// SCÈNE 10 — Plans 18-19 (TV). s10a : sur la carte du pays, des assiettes d'œufs au bacon surgissent de ville en ville.
// s10b : retour dans la cuisine de la famille : la poêle grésille, la mère sert le bacon, le journal ouvert sur la table : « Si les docteurs le disent, c'est que c'est bon ! »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.05]]); carteNB(cc, t, seg(la, .2, A[1] + .2)); }
    else {
      cam(cc, t, [[B[0], 600, 450, 1.15], [DUREE, 620, 440, 1.2]]);
      const P = PERE(t, 360, { face: 1, look: [.5, .6], sourire: 1, handR: [90, -600], poseR: 'poing' });
      const Mr = voix(MERE(t, 820, { face: -1, look: [.9, -.1], sourire: 1, handL: [-150, -600], poseL: 'ouverte' }), ['s10b'], t);
      cuisineNB(cc, t, { menu: 'copieux', annee: 1925, pere: P, mere: Mr, poele: true, journal: [590, 560, .22, -.1] });
      const h = mainF(P, 1); cc.save(); cc.translate(h[0], h[1]); cc.rotate(-.6); F(cc, poly([[-3, 0], [3, 0], [3, 60], [-3, 60]]), GRIS.clair, 1.5); cc.restore();
    }
  });
  debutFlash(c, t);
}
