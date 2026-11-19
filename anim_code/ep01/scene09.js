// SCÈNE 09 — un projecteur sur un pot posé sur un piédestal ; une cliente éblouie. Narrateur s09a.
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const l = local('s09a', t), D = L.s09a[1], lum = ease(seg(l, .2, .8)), pied = ease(seg(l, D * .3, D * .3 + .6));
    cam(cc, t, [[0, 540, 405, 1.0], [L.s09a[0] + D * .3, 600, 440, 1.14], [L.s09a[0] + D * .6, 640, 380, 1.3], [DUREE, 600, 400, 1.12]]);
    magasinNB(cc, t);
    cc.fillStyle = `rgba(0,0,0,${.35 * lum})`; cc.fillRect(0, 0, W, H);                                                    // la salle s'assombrit
    projecteur(cc, 640, 600, lum);
    const py = 600 - pied * 120; F(cc, poly([[590, 600], [690, 600], [680, py], [600, py]]), GRIS.blanc, 4); F(cc, ell(640, py, 50, 12), GRIS.clair, 4); F(cc, ell(640, 600, 56, 12), GRIS.moyen, 3);
    pot(cc, 640, py, .9, 'luxe', t);
    const V = vendeurBase(t, 300); V.handR = [180, -560]; V.poseR = 'ouverte'; V.look = [1, 0]; V.sourcil = .5; V.sourire = 1.3; dessine(cc, V, drawVendeur);
    const F2 = { x: 900, y: 790, s: .6, t: step(t), v: 1, face: -1, look: [-1, .2], bob: bnc(step(t), .3) * 3, handR: [30, -640], poseR: 'ouverte', handL: [-92, -400], sourire: 1, talk: .25 * lum };
    if (l > D * .6) { F2.tilt = -.1; F2.look = [-1, -.2]; F2.blink = (t % .8) < .12 ? 1 : 0; }                              // éblouie
    dessine(cc, F2, drawFigurant);
  });
  debutFlash(c, t);
}
