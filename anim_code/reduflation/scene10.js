// SCÈNE 10 — Plans 18-19 (TV). s10a : une année de paquets alignés, de janvier à novembre : 15, 14, 13, 12, 11, 10 biscuits… et toujours « 2 F ».
// s10b : le graphique : la ligne du prix affiché reste plate, celle du prix au kilo grimpe en silence (+50 %).
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 400, 1.04]]); anneePaquets(cc, t, seg(la, .1, A[1])); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); courbesPrix(cc, t, seg(lb, .1, B[1])); }
  });
  debutFlash(c, t);
}
