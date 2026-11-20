// SCÈNE 04 — Plans 06-07 (TV). s04a : sur le fjord, les cages flottantes se multiplient, les saumons y sautent par dizaines.
// s04b : carte du monde : depuis la Norvège, des pointillés cherchent un pays… et s'arrêtent sur le Japon.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.15], [B[0], 540, 460, 1.02]]); fjordNB(cc, t, { cages: Math.min(6, 2 + Math.floor(seg(la, 0, A[1]) * 5)) }); }
    else { cam(cc, t, [[B[0], 560, 380, 1.0], [DUREE, 700, 300, 1.15]]); carteMonde(cc, t, seg(lb, .2, B[1])); }
  });
  debutFlash(c, t);
}
