// SCÈNE 10 — Plans 18-19 (TV). s10a : dans une rédaction, le rédacteur en chef fusille du regard la radio posée sur son bureau ; au mur, la courbe « LECTEURS » plonge.
// s10b : il tape du poing et dicte le titre : on voit le mot « PANIQUE » grossir sur la maquette, trois fois plus gros que le reste.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 480, 430, 1.15], [B[0], 460, 430, 1.2], [DUREE, 460, 430, 1.25]]);
    const Re = figurant(t, 360, 0, { s: .52, y: 790, face: 1, look: [.7, .5], froncer: 1, chapeau: COIFFE.visiere, habit: (c2, shY) => { for (const sd of [-1, 1]) { ink(c2, 10, GRIS.noir); c2.beginPath(); c2.moveTo(sd * 40, shY - 4); c2.lineTo(sd * 34, -404); c2.stroke(); } } });
    if (lb >= 0) { const k = Math.abs(Math.sin(lb * 4)); Re.handR = [140, lerp(-520, -660, k)]; Re.poseR = 'poing'; Re.look = [.6, .3]; }
    redactionNB(cc, t, { derriere: (c2) => dessine(c2, Re) });
    if (lb >= 0) { const s = 1 + 2 * ease(seg(lb, .3, 1.6)); cc.save(); cc.translate(330, 560); F(cc, poly([[-130, -40], [130, -40], [130, 40], [-130, 40]]), GRIS.blanc, 2); cc.font = `bold ${Math.round(14 * s)}px Georgia`; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('PANIQUE', 0, 8); cc.restore(); }
  });
  debutFlash(c, t);
}
