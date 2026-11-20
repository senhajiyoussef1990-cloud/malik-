// SCÈNE 12 — Plans 22-23 (TV). s12a : sur un escalier de douze marches minuscules, un passant monte sans s'en rendre compte, une marche à la fois.
// s12b : vue d'en haut : il est tout en haut… « sans l'avoir vu » ; en bas, l'ancien paquet de quinze, en haut le paquet de dix.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    const u = seg(t, A[0], B[0] + B[1]);
    cam(cc, t, [[0, 300, 600, 1.3], [B[0], 600, 400, 1.0], [DUREE, 600, 380, 1.04]]);
    escalier(cc, t, u); paquetNB(cc, 120, 700, .5, { n: 15 }); if (lb > 0) paquetNB(cc, 1000, 140, .5, { n: 10, air: 1 });
  });
  debutFlash(c, t);
}
