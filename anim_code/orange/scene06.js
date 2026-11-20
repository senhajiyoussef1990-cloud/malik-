// SCÈNE 06 — Plans 10-11 (TV). s06a : à l'agence, le publicitaire tourne une orange dans sa main… une ampoule s'allume au-dessus de sa tête : la boire !
// s06b : carton explicatif : trois oranges glissent et se fondent en un seul verre de jus.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 480, 400, 1.3], [B[0], 470, 380, 1.4]]);
      const Pu = PUBLICITAIRE(t, 470, { face: 1, look: [.6, .6], handR: [120, -600], poseR: 'poing' });
      const idee = la > A[1] * .55;
      if (idee) { Pu.look = [.2, -.8]; Pu.sourire = 1.2; Pu.sourcil = 1; Pu.handL = [-130, -760]; Pu.poseL = 'pointe'; }
      agenceNB(cc, t, { affiche: 0, derriere: (c2) => dessine(c2, Pu, drawVendeur) });
      const h = mainF(Pu, 1); orangeNB(cc, h[0] + 6, h[1] - 6, 20);
      if (idee) { const v = ease(seg(la, A[1] * .55, A[1] * .55 + .3)); cc.save(); cc.translate(470, 360); cc.scale(v, v); for (let k = 0; k < 10; k++) { ink(cc, 4, GRIS.noir); const a = k * .628; cc.beginPath(); cc.moveTo(Math.cos(a) * 46, Math.sin(a) * 46 - 10); cc.lineTo(Math.cos(a) * 66, Math.sin(a) * 66 - 10); cc.stroke(); } F(cc, ell(0, -10, 30, 34), GRIS.blanc, 4); F(cc, poly([[-14, 20], [14, 20], [12, 40], [-12, 40]]), GRIS.moyen, 3); cc.restore(); }
    } else { cam(cc, t, [[B[0], 540, 405, 1.0]]); troisOranges(cc, t, seg(lb, .1, B[1])); }
  });
  debutFlash(c, t);
}
