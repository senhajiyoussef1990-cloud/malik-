// SCÈNE 04 — Plans 06-07 (TV). Un marchand dispose une casserole ordinaire sur son stand. Puis il ajoute un sablier bien visible et l'enseigne « DERNIÈRE CHANCE ».
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 540, 450, 1.25], [DUREE, 540, 420, 1.15]]);
    standNB(cc, t, { panneau: seg(lb, .2, .9), sablier: lb >= 0 ? seg(lb, .4, 30) : null });
    const V = VENDEUR(t, 420, { face: 1, look: [.8, .3], sourire: 1 });
    if (la >= 0 && lb < 0) { V.handR = [200, -520]; V.poseR = 'ouverte'; V.lean = .06; }
    if (lb >= 0) { V.handR = [180, -720]; V.handL = [-60, -720]; V.poseR = V.poseL = 'ouverte'; V.look = [.6, -.6]; V.sourire = 1.4; }
    dessine(cc, V, drawVendeur);
  });
  debutFlash(c, t);
}
