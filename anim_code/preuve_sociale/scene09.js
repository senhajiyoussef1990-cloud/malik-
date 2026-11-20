// SCÈNE 09 — Plans 14-16 (TV). s09a : le marchand accroche « LE CHAPEAU DE L'ANNÉE ! » en souriant (l'étiquette arrive après l'engouement).
// s09b : gros plan sur les visages : les regards se croisent, une tête acquiesce. s09c : la cliente essaie le chapeau, lève et baisse le bord.
const A = L.s09a, B = L.s09b, C = L.s09c, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : C[0] + C[1] + 0.45);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), lA = t - A[0], lB = t - B[0], lC = t - C[0];
    cam(cc, t, [[0, 600, 400, 1.3], [B[0] - .2, 600, 420, 1.3], [B[0] + .3, 330, 400, 1.9], [C[0] - .2, 330, 400, 1.9], [C[0] + .3, 470, 420, 1.7], [DUREE, 480, 420, 1.6]]);
    const pan = ease(seg(lA, .3, A[1] * .8)); chapellerieNB(cc, t, { spot: .7, panneau: pan, vedette: lC < 0 });
    const V = marchandBase(t, 700); V.face = -1; V.sourire = 1.4; V.look = [.6, -.6];
    if (lA >= 0 && pan < 1) { V.handL = [-140, -900]; V.handR = [140, -900]; V.poseL = V.poseR = 'ouverte'; V.lean = -.04; }
    else if (lA >= 0) { V.handR = [140, -620]; V.poseR = 'ouverte'; V.look = [.8, -.1]; V.wink = lB < 0 ? 1 : 0; }
    dessine(cc, V, drawVendeur);
    file(cc, t, 9, { modif: (P, k) => {
      if (lB >= 0 && lC < 0) { P.look = [hash(k * 5 + Math.floor(lB * 1.5)) > .5 ? .9 : -.9, 0]; if (k === 2 || k === 4) P.tilt = Math.sin(lB * 7) * .08; }   // regards croisés, têtes qui acquiescent
      if (k === 0) { P.v = 1;
        if (lC >= 0) { const b = Math.sin(lC * 4.5); P.chapeau = (c2, hy) => chapeauNB(c2, 0, hy - 64 - Math.max(0, b) * 22, .62, 0, -.06 + b * .12);   // elle lève et baisse le bord
          P.handL = [-60, -840 - Math.max(0, b) * 30]; P.handR = [60, -840 - Math.max(0, b) * 30]; P.poseL = P.poseR = 'poing'; P.look = [0, -.6]; } }
    } });
  });
  debutFlash(c, t);
}
