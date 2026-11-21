// SCÈNE 08 — Plans 14-15 (TV). s08a : à la fabrique, une presse imprime la même phrase sur des boîtes qui défilent par milliers (compteur : 100… 1 000 000 de boîtes).
// s08b : gros plan sur le bandeau rouge d'une boîte : « LE REPAS LE PLUS IMPORTANT ! »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); chaineBoites(cc, t, seg(la, 0, A[1])); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 640, 2.0]]); cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); boiteNB(cc, 540, 400, 2.4, { sucre: true, slogan: true, jouet: true }); }
  });
  debutFlash(c, t);
}
