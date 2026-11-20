// SCÈNE 07 — Plan 12 (TV). « Chacun suppose que les autres ont une raison. » La file s'allonge ; les regards se croisent.
const A = L.s07a, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : A[0] + A[1] + 0.54);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 420, 440, 1.35], [A[0] + A[1], 380, 420, 1.0], [DUREE, 400, 410, 1.0]]);
    chapellerieNB(cc, t, { spot: .6 });
    const V = marchandBase(t, 720); V.face = -1; V.sourire = 1.3; V.look = [.9, -.1]; V.handR = [96, -470]; V.poseR = 'poing'; dessine(cc, V, drawVendeur);
    const n = 5 + 6 * ease(seg(t, 0, A[0] + A[1] + .6));
    file(cc, t, n, { regarde: true, modif: (P, k) => { if (k % 3 === 1) { P.handR = [60, -560]; P.poseR = 'poing'; } } });
  });
  debutFlash(c, t);
}
