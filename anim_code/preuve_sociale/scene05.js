// SCÈNE 05 — Plans 09-10 (TV). s05a : deux curieux s'arrêtent ensemble ; un doigt désigne le chapeau, les deux têtes pivotent.
// s05b : « La foule attire la foule » : un troisième, puis un quatrième passant les rejoignent.
const A = L.s05a, B = L.s05b, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : B[0] + B[1] + 1.0);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), lA = t - A[0];
    cam(cc, t, [[0, 540, 440, 1.2], [A[0] + A[1] * .5, 500, 460, 1.4], [B[0], 470, 450, 1.25], [DUREE, 440, 430, 1.1]]);
    chapellerieNB(cc, t, { spot: .6 });
    const V = marchandBase(t, 720); V.face = -1; V.sourire = .9; V.look = [.9, 0]; if (t > B[0]) { V.sourire = 1.4; V.handL = [-60, -440]; V.handR = [60, -440]; V.poseL = V.poseR = 'poing'; }
    dessine(cc, V, drawVendeur);
    const n = 2 * ease(seg(t, .1, A[0] + 1.2)) + 2 * ease(seg(t, B[0], B[0] + B[1] + .3));
    file(cc, t, n, { modif: (P, k) => {
      if (k === 0 && lA > A[1] * .35) { const kk = ease(seg(lA, A[1] * .35, A[1] * .35 + .3)); P.handR = [lerp(80, 220, kk), lerp(-420, -640, kk)]; P.poseR = 'pointe'; P.look = [-1, -.3]; P.talk = .3 * Math.abs(Math.sin(t * 9)) * (t < A[0] + A[1]); }
      if (k === 1 && lA > A[1] * .5) { P.look = [-1, -.3]; P.tilt = -.08; }
      if (k >= 2 && Math.min(1, n - k) >= 1) { P.look = [hash(k + Math.floor(t)) > .5 ? -1 : .8, -.2]; }
    } });
  });
  debutFlash(c, t);
}
