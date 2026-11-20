// SCÈNE 04 — Plans 06-07 (TV). On inaugure la fontaine ; la caméra arrive à hauteur de la foule.
// Premier photographe : il tourne son appareil vers les enfants qui rient près de l'eau → « une fête joyeuse ».
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const lb = t - B[0], vise = ease(seg(lb, .2, .8));
    cam(cc, t, [[0, 540, 300, 1.0], [A[0] + A[1], 540, 470, 1.15], [DUREE, 540, 470, 1.15]]);
    placeFeteNB(cc, t, { ruban: seg(t, A[0] + A[1] * .5, A[0] + A[1]) });
    const P = PHOTOGRAPHE(t, 250, 0, { y: 790, face: 1, look: [.9, -.1] }); dessine(cc, P); appareil(cc, 300, 560, .9, lerp(.3, -.05, vise));
    viseur(cc, CADRES.fete, vise);
  });
  debutFlash(c, t);
}
