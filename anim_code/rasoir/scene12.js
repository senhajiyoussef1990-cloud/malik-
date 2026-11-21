// SCÈNE 12 — Plans 22-23 (TV). s12a : devant le miroir de la salle de bains, le rasoir posé ; le calendrier « MATIN » égrène les jours… et ça recommence.
// s12b : deux femmes côte à côte, l’une avec son rasoir, l’autre sans : LIBRE · LIBRE.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 620, 360, 1.12]]); matinRasoir(cc, t, seg(la, 0, A[1])); }
    else { cam(cc, t, [[B[0], 540, 420, 1.05]]); libres(cc, t, seg(lb, B[1] * .3, B[1] * .3 + .5)); }
  });
  debutFlash(c, t);
}
