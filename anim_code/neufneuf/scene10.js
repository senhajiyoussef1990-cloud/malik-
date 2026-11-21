// SCÈNE 10 — Plans 18-19 (TV). s10a : une rue commerçante : MODE, MEUBLES, RADIOS, CHAUSSURES… et partout des prix en ,99.
// s10b : un compteur s’emballe sous un grand œil : des milliers de fois trompé… gratuitement.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) rue99(cc, t, seg(la, 0, A[1])); else compteurOeil(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
