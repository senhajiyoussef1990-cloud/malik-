// TEST ANIMATION VIVANTE (même scène que la 05) — SCÈNE 05 — Plans 09-10 (TV). s05a : deux curieux s'arrêtent ensemble ; un doigt désigne le chapeau, les deux têtes pivotent.
// s05b : « La foule attire la foule » : un troisième, puis un quatrième passant les rejoignent.
const A = L.s05a, B = L.s05b, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : B[0] + B[1] + 0.45);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), lA = t - A[0];
    plans(cc, t, [[0, 560, 440, 1.15], [A[0] + A[1] * .3, 470, 380, 1.9], [A[0] + A[1] * .75, 720, 360, 1.9], [B[0], 520, 440, 1.25], [B[0] + B[1] * .6, 380, 420, 1.6]]);
    chapellerieNB(cc, t, { spot: .6 });
    const V = marchandBase(t, 720); V.face = -1; V.sourire = .9; V.look = [.9, 0]; if (t > B[0]) { V.sourire = 1.4; V.handL = [-60, -440]; V.handR = [60, -440]; V.poseL = V.poseR = 'poing'; }
    vivant(V, t, { phase: 2.3 }); dessine(cc, V, drawVendeur);
    const n = 2 * ease(seg(t, .1, A[0] + 1.2)) + 2 * ease(seg(t, B[0], B[0] + B[1] + .3));
    file(cc, t, n, { modif: (P, k) => {
      if (k === 0 && lA > A[1] * .35) { const kk = ease(seg(lA, A[1] * .35, A[1] * .35 + .3)); P.handR = [lerp(80, 220, kk), lerp(-420, -640, kk)]; P.poseR = 'pointe'; P.look = [-1, -.3]; P.talk = .3 * Math.abs(Math.sin(t * 9)) * (t < A[0] + A[1]); }
      if (k === 1 && lA > A[1] * .5) { P.look = [-1, -.3]; P.tilt = -.08; }
      if (k >= 2 && Math.min(1, n - k) >= 1) { P.look = [hash(k + Math.floor(t)) > .5 ? -1 : .8, -.2]; }
      vivant(P, t, { phase: k * 1.3 + .4 });
      if (k === 0 && lA > A[1] * .35 && lA < A[1]) { const b = battement(['s05a'], t); P.handR = [P.handR[0] + b * 12, P.handR[1] - b * 40]; P.tilt += b * .05; }
    } });
  });
  debutFlash(c, t);
}
