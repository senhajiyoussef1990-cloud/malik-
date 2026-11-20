// SCÈNE 04 — Plans 06-07 (TV). Le joueur glisse un jeton ; un petit tiroir s'ouvre. Premier essai : un ticket blanc, rien de particulier.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 620, 460, 1.3], [DUREE, 640, 480, 1.35]]);
    feteNB(cc, t, {}); machine(cc, 700, 760, 1.0, t, { clignote: true, jeton: seg(la, .2, 1), tiroir: seg(lb, 0, .4), contenu: 'vide', tourne: t * 3 * (lb < 0) });
    const J = JOUEUR(t, 470, { look: [.8, .3] }); if (la >= 0 && lb < 0) { J.handR = [240, -560]; J.poseR = 'pointe'; } if (lb >= 0) { J.look = [.6, .8]; J.sourire = -.2; J.sourcil = .4; }
    dessine(cc, J);
  });
  debutFlash(c, t);
}
