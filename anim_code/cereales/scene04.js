// SCÈNE 04 — Plans 06-07 (TV). s04a : devant la maison de santé, des patients en peignoir blanc font leur gymnastique ; dans la cuisine expérimentale, la pâte de maïs passe entre les rouleaux et sort en flocons.
// s04b : le médecin goûte un flocon, l'air très sérieux : un repas « simple, fade » — sur une ardoise, « PAS D'ÉPICES, PAS DE VIANDE ».
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (la < A[1] * .45) { cam(cc, t, [[0, 540, 430, 1.05]]); sanaNB(cc, t, { gym: 1 }); }
    else {
      cam(cc, t, [[0, 560, 420, 1.12], [DUREE, 600, 420, 1.2]]);
      const D = MEDECIN(t, 330, { face: 1, look: [.7, .4], froncer: .5 });
      if (lb >= 0) { D.handR = [40, -700]; D.poseR = 'poing'; D.look = [.2, -.3]; D.froncer = .8; D.sourire = 0; }
      cuisineFloconsNB(cc, t, { derriere: (c2) => dessine(c2, D) });
      if (lb >= 0) { const h = mainF(D, 1); floconNB(cc, h[0], h[1] - 10, 10, t); cc.save(); cc.translate(900, 200); F(cc, poly([[-130, -70], [130, -70], [130, 70], [-130, 70]]), '#2e2e2c', 6); cc.font = 'bold 22px Georgia'; cc.textAlign = 'center'; cc.fillStyle = 'rgba(240,240,230,.92)'; cc.fillText('PAS D’ÉPICES', 0, -14); cc.fillText('PAS DE VIANDE', 0, 22); cc.fillText('= CALME', 0, 54); cc.restore(); }
    }
  });
  debutFlash(c, t);
}
