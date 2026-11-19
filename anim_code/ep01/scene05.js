// SCÈNE 05 — un vendeur présente un pot posé seul sur un coussin, comme un trésor. Narrateur s05a.
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 405, 1.0], [2, 620, 420, 1.15], [DUREE, 640, 400, 1.26]]);
    magasinNB(cc, t); comptoirNB(cc, 420, 980, 560);
    projecteur(cc, 700, 560, .6 + .4 * Math.sin(t * 3) ** 2);
    F(cc, smooth([[600, 562], [610, 530], [790, 530], [800, 562]]), GRIS.noir, 4); F(cc, ell(700, 532, 96, 16), GRIS.fonce, 3);   // coussin de velours
    for (let k = -3; k <= 3; k++) F(cc, ell(700 + k * 30, 560, 8, 10), GRIS.noir, 2);                                           // franges
    pot(cc, 700, 532, 1.0, 'luxe', t);
    const V = vendeurBase(t, 300), u = ease(seg(t, .3, 1.2));
    V.handR = [lerp(96, 300, u), lerp(-400, -560, u) + wob(step(t), .8, 10)]; V.poseR = 'ouverte'; V.handL = [-60, -620]; V.poseL = 'ouverte'; V.look = [1, .2]; V.sourcil = .8;
    V.talk = 0; V.tilt = .06 + wob(step(t), .6, .04); dessine(cc, V, drawVendeur);
  });
  debutFlash(c, t);
}
