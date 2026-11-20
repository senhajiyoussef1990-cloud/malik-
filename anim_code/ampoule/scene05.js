// SCÈNE 05 — Plans 08-09 (TV). s05a : dans le grand salon d'un hôtel de Genève (lustre, drapeaux, vue sur le lac et son jet d'eau), un industriel en haut-de-forme et monocle se lève et frappe la table : « Messieurs, nos ampoules durent beaucoup trop longtemps ! »
// s05b : autour de la longue table, les autres fabricants du monde hochent la tête ; un majordome ferme les rideaux et la porte à clé : réunion secrète.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 420, 1.18], [B[0], 540, 410, 1.05], [DUREE, 540, 400, 1.08]]);
    const I = voix(INDUSTRIEL(t, 540, 0, { face: 1, look: [.2, .1], froncer: .7, sourcil: .8 }), ['s05a'], t);
    if (la >= 0 && lb < 0) { const k = Math.abs(Math.sin(la * 4.5)); I.handR = [150, lerp(-540, -680, k)]; I.poseR = 'poing'; I.handL = [-170, -620]; I.poseL = 'ouverte'; }
    const autres = [[180, 1], [340, 2], [740, 3], [900, 1]].map(([x, k]) => INDUSTRIEL(t, x, k, { s: .46, face: x < 540 ? 1 : -1, look: [x < 540 ? .7 : -.7, 0] }));
    if (lb >= 0) autres.forEach((p, k) => { p.tilt += Math.sin(t * 5 + k) * .05; p.sourire = .6; });
    geneveNB(cc, t, { derriere: (c2) => { autres.forEach(p => dessine(c2, p)); dessine(c2, I); } });
    if (lb >= 0) { const r = ease(seg(lb, .2, 1.2)); for (const sd of [-1, 1]) F(cc, poly([[540 + sd * 140, 90], [540 + sd * (140 - 140 * r), 90], [540 + sd * (140 - 140 * r), 400], [540 + sd * 140, 400]]), GRIS.fonce, 2); cc.font = 'italic bold 26px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; if (r > .9) { F(cc, poly([[380, 690], [700, 690], [700, 750], [380, 750]]), GRIS.noir, 3); cc.fillStyle = GRIS.blanc; cc.fillText('RÉUNION SECRÈTE', 540, 730); } }
  });
  debutFlash(c, t);
}
