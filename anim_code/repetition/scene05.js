// SCÈNE 05 — Plan 08 (TV). « Bientôt, la rue ne voit plus qu'elle. » Des colleurs recouvrent le mur de dizaines d'exemplaires.
const A = L.s05a, DUREE = A[0] + A[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), n = 6 + 18 * ease(seg(t, 0, DUREE - .2));
    cam(cc, t, [[0, 560, 420, 1.35], [DUREE, 540, 405, 1.02]]);
    murAffichesNB(cc, t, n);
    echelle(cc, 380, 760);
    const C1 = figurant(t, 380, 3, { s: .46, y: 600, chapeau: COIFFE.casquette, tablier: 'noir', look: [0, -1], handR: [80, -900 + Math.sin(t * 8) * 40], poseR: 'poing', handL: [-90, -700], poseL: 'poing' });
    dessine(cc, C1); pinceau(cc, ...mainF(C1, 1), -.2 + Math.sin(t * 8) * .3);
    const C2 = figurant(t, 720, 2, { s: .5, y: 770, chapeau: COIFFE.casquette, look: [0, -.8], handR: [60, -880], handL: [-60, -880], poseR: 'ouverte', poseL: 'ouverte' });
    dessine(cc, C2); seau(cc, 820, 770);
  });
  debutFlash(c, t);
}
