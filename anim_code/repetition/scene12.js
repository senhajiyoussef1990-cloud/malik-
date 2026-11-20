// SCÈNE 12 — Plan 21 (TV). « La phrase vient d'une campagne, pas d'une découverte. » L'imprimeur pose sur la table un contrat publicitaire ordinaire.
const A = L.s12a, DUREE = A[0] + A[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], k = seg(la, 0, .8);
    cam(cc, t, [[0, 400, 450, 1.3], [A[0] + .9, 320, 480, 1.7], [DUREE, 310, 480, 1.75]]);
    imprimerieNB(cc, t, { vit: .2, pile: 14, contrat: k });
    const I = figurant(t, 470, 0, { s: .5, y: 770, tablier: 'taches', chapeau: COIFFE.visiere, face: -1, look: [.6, .6], sourire: .3 });
    if (k < 1) { I.handR = [lerp(80, 200, ease(k)), lerp(-420, -560, ease(k))]; I.poseR = 'ouverte'; I.lean = .06 * k; } else { I.handR = [80, -470]; I.handL = [-80, -470]; I.poseL = I.poseR = 'poing'; I.look = [-.4, 0]; I.sourcil = .5; }
    dessine(cc, I);
  });
  debutFlash(c, t);
}
