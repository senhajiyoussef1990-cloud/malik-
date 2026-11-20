// SCÈNE 05 — Plans 08-09 (TV). Un décorateur accroche un diplôme spectaculaire sur le mur. Deux assistants installent un pupitre imposant et une pile de dossiers.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0], dip = ease(seg(la, .1, .9)), pu = ease(seg(lb, .1, .9));
    cam(cc, t, [[0, 700, 330, 1.4], [B[0], 700, 330, 1.4], [B[0] + .4, 540, 420, 1.1], [DUREE, 540, 420, 1.1]]);
    auditoriumNB(cc, t, { rideau: 1, diplome: dip, pupitre: lb >= 0 ? .4 + .6 * pu : 0, dossiers: lb >= 0 ? Math.floor(pu * 8) : 0 });
    dessine(cc, figurant(t, 880, 3, { s: .46, y: 540, face: -1, chapeau: COIFFE.casquette, look: [.8, -.5], handR: [180, -860], handL: [40, -860], poseR: 'poing', poseL: 'poing' }));
    if (lb >= 0) for (const [x, v] of [[360, 2], [720, 0]]) dessine(cc, figurant(t, x, v, { s: .44, y: 540, face: x < 540 ? 1 : -1, chapeau: COIFFE.casquette, tablier: 'noir', look: [.8, .3], lean: .1, handR: [140, -480], handL: [-40, -480], poseR: 'poing', poseL: 'poing' }));
  });
  debutFlash(c, t);
}
