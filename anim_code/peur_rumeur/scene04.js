// SCÈNE 04 — Plans 06-07 (TV). s04a : le village la nuit, travelling de la fontaine à la ruelle. s04b : au bout de la ruelle, une porte claque ; un nuage passe.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const lb = t - B[0];
    if (lb < -.2) { cam(cc, t, [[0, 520, 500, 1.5], [B[0] - .3, 900, 400, 1.6]]); placeNB(cc, t, { nuit: .85 }); }
    else { const cl = lb > .2 && lb < .6 ? Math.sin((lb - .2) * 25) * .35 * (1 - (lb - .2) / .4) : 0;     // la porte claque une fois
      cam(cc, t, [[0, 540, 420, 1.15], [DUREE, 540, 420, 1.3]]); ruelleNB(cc, t, { porte: Math.abs(cl) + (lb < .2 ? .5 * (1 - lb / .2) : 0), nuage: true }); }
  });
  debutFlash(c, t);
}
