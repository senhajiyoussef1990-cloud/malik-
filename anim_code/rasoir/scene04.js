// SCÈNE 04 — Plans 06-07 (TV). s04a : devant la vitrine « POUR MESSIEURS », des hommes moustachus achètent ; un camembert « LE MARCHÉ » : hommes… femmes ?
// s04b : croquis de mode 1905 → 1915 → 1925 : les manches disparaissent, l’ourlet remonte.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.05], [B[0], 600, 420, 1.12]]); vitrineNB(cc, t, { marche: seg(la, A[1] * .4, A[1] * .9), derriere: (c2) => { dessine(c2, figurant(t, 220, 0, { s: .5, y: 800, face: 1, look: [.5, -.3] })); dessine(c2, marche(figurant(t, lerp(-80, 460, seg(la, 0, 3)), 2, { s: .48, y: 800, face: 1, look: [.6, 0] }), t, 6)); } }); }
    else { cam(cc, t, [[B[0], 540, 410, 1.0], [DUREE, 560, 410, 1.05]]); modeRobes(cc, t, seg(lb, .1, B[1] * .9)); }
  });
  debutFlash(c, t);
}
