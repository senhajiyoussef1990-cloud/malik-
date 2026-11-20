// SCÈNE 05 — Plans 08-09 (TV). Le premier passant s'arrête : il regarde le sablier, pas la casserole.
// Le vendeur montre le sable qui descend en exagérant son geste : « L'offre s'arrête dans un instant ! »
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 620, 460, 1.3], [DUREE, 640, 460, 1.3]]);
    standNB(cc, t, { panneau: 1, sablier: .3 + t * .04 });
    const V = VENDEUR(t, 420, { face: 1, look: [.8, 0], sourire: 1.2 });
    if (lb >= 0) { voix(V, ['s05b'], t); V.handR = [300 + Math.sin(t * 8) * 30, -620]; V.poseR = 'pointe'; V.sourcil = 1; V.tilt = wob(tq, 2, .08); }
    dessine(cc, V, drawVendeur);
    const P = figurant(t, lerp(1150, 860, ease(seg(t, 0, 1.2))), 2, { s: .48, y: 790, face: -1, chapeau: COIFFE.casquette, look: [.6, -.5] });
    if (t < 1.2) marche(P, t); else { P.sourcil = 1; P.lid = 0; P.look = [.9, -.6]; P.froncer = .3; }
    dessine(cc, P);
  });
  debutFlash(c, t);
}
