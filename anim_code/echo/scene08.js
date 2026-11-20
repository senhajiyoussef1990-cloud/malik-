// SCÈNE 08 — Plans 14-15 (TV). Une petite factrice arrive du pont, mais personne ne l'écoute. Elle montre une photographie du pont ouvert : « Je viens de traverser le pont ! »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0], ar = ease(seg(la, 0, A[1]));
    cam(cc, t, [[0, 640, 460, 1.15], [DUREE, 700, 470, 1.25]]);
    placeNB(cc, t, {});
    for (let k = 0; k < 6; k++) dessine(cc, figurant(t, 100 + k * 110, k + 1, { s: .44, y: 800, face: k % 2 ? 1 : -1, look: [k % 2 ? .7 : -.7, 0], talk: .3 * Math.abs(Math.sin(t * 9 + k)), chapeau: [COIFFE.casquette, COIFFE.foulard, COIFFE.toque][k % 3] }));
    const Fa = FACTRICE(t, lerp(1160, 860, ar)); if (ar < 1) marche(Fa, t);
    if (lb >= 0) { voix(Fa, ['s08b'], t); Fa.handR = [200, -660]; Fa.poseR = 'poing'; Fa.sourcil = .8; }
    dessine(cc, Fa); if (lb >= 0) { const [hx, hy] = mainF(Fa, 1); photoPont(cc, hx - 10, hy - 50, .7, 'ce matin'); }
  });
  debutFlash(c, t);
}
