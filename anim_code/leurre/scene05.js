// SCÈNE 05 — Plans 08-09 (TV). s05a : le lecteur pointe la troisième offre : « Le papier seul au même prix que les deux ? Je prends les deux, évidemment ! »
// s05b : sous chaque offre, une barre de résultats : 16 % · 0 % · 84 %.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 640, 420, 1.1]]); offresNB(cc, t, 1); dessine(cc, voix(LECTEUR(t, 620, { s: .55, y: 960, face: 1, look: [.6, -.6], sourire: 1, handR: [140, -760], poseR: 'pointe' }), ['s05a'], t)); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); offresNB(cc, t, 1, { choix: [16, 0, 84], barres: seg(lb, .2, 1.5), leurre: lb > B[1] * .6 }); }
  });
  debutFlash(c, t);
}
