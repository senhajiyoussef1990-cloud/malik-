// SCÈNE 04 — Plans 06-08 (TV, N&B). s04a : la ville imaginaire, le marchand installe son chapeau.
// s04b : personne ne s'y intéresse ; il époussette le présentoir désert. s04c : un passant hésite, hausse les épaules et s'en va.
const A = L.s04a, B = L.s04b, C = L.s04c, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : C[0] + C[1] + 0.45);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t);
    cam(cc, t, [[0, 540, 405, 1.0], [A[0] + .3, 540, 405, 1.0], [A[0] + A[1], 620, 440, 1.3], [B[0] + B[1] * .5, 640, 470, 1.45], [C[0], 600, 440, 1.15], [DUREE, 560, 430, 1.1]]);
    chapellerieNB(cc, t, { spot: .5 });
    // feuilles mortes qui traversent la rue déserte
    for (let k = 0; k < 4; k++) { const x = ((t * 120 + k * 300) % 1300) - 100, y = 700 + Math.sin(t * 3 + k) * 20 + k * 20; cc.save(); cc.translate(x, y); cc.rotate(t * 4 + k); F(cc, smooth([[-10, 0], [0, -6], [10, 0], [0, 6]]), GRIS.fonce, 1.5); cc.restore(); }
    const V = marchandBase(t, 700); V.face = -1; V.look = [.6, 0];
    const lA = t - A[0], lB = t - B[0], lC = t - C[0];
    let plum = null;
    if (lA >= 0 && t < B[0]) { const k = ease(seg(lA, .3, 1.2)); V.handR = [lerp(92, 140, k), lerp(-400, -760, k)]; V.poseR = 'ouverte'; V.sourire = 1.2; V.look = [.9, -.4]; V.tilt = wob(tq, .6, .05); }   // il ajuste son chapeau-vedette
    if (lB >= 0) { const ph = Math.sin((t - B[0]) * 9); V.handR = [150 + ph * 40, -640 + Math.abs(ph) * 30]; V.poseR = 'poing'; V.look = [.9, .2]; V.lean = .06; V.sourire = .4; plum = 1; V.bob += Math.abs(ph) * 3; }   // il époussette
    if (lC >= 0) { V.look = [.7, -.1]; V.sourire = 1; }
    dessine(cc, V, drawVendeur);
    if (plum) { const ph = Math.sin((t - B[0]) * 9), hx = V.x - (150 + ph * 40) * V.s, hy = V.y - V.bob + (-640 + Math.abs(ph) * 30) * V.s; plumeau(cc, hx, hy, -1.1 + ph * .4); }
    // le passant : arrive de la droite, ralentit, hausse les épaules, repart à gauche
    if (lC > -1) {
      const u = seg(lC, -1, C[1] + .8), x = u < .35 ? lerp(1180, 470, ease(u / .35)) : u < .7 ? 470 : lerp(470, -150, ease((u - .7) / .3));
      const P = passant(t, x, 2, { face: -1, s: .42 }); const arret = u >= .35 && u < .7;
      if (!arret) { P.walk = t * 9; P.bob = Math.abs(Math.sin(t * 9)) * 6; P.look = [.8, 0]; }
      else { const k = (u - .35) / .35; P.look = [-.6, -.3]; P.tilt = .08; if (k > .45) { P.handL = [-150, -560]; P.handR = [150, -560]; P.poseL = P.poseR = 'ouverte'; P.tilt = -.12; P.look = [.4, 0]; P.bob += -8; } }
      dessine(cc, P, drawFigurant);
    }
  });
  debutFlash(c, t);
}
