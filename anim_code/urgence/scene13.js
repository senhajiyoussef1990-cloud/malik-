// SCÈNE 13 — Plan 24 (TV). « Le sablier ne décide plus pour eux. » Le vendeur enlève ses panneaux et ferme son stand, tranquillement.
const A = L.s13a, DUREE = A[0] + A[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0];
    cam(cc, t, [[0, 540, 430, 1.1]]);
    standNB(cc, t, { panneau: 1 - ease(seg(la, .1, .7)), ferme: seg(la, .6, A[1] + .5) });
    dessine(cc, VENDEUR(t, 900, { face: -1, look: [.8, -.3], sourire: .6, handR: [100, -800], poseR: 'poing', handL: [-100, -800], poseL: 'poing' }), drawVendeur);
  });
  debutFlash(c, t);
}
