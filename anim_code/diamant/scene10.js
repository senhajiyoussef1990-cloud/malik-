// SCÈNE 10 — Plans 18-19 (TV). s10a : l'affiche « Combien vaut votre amour ? » : deux pages de calendrier = 2 MOIS DE SALAIRE.
// s10b : à la joaillerie, un jeune fiancé vide son enveloppe de paie sur le comptoir : « Deux mois de salaire ? Bon… si c'est la règle. »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 420, 1.05]]); afficheSalaire(cc, t, seg(la, .3, A[1])); }
    else {
      cam(cc, t, [[B[0], 520, 440, 1.25], [DUREE, 520, 430, 1.3]]);
      const Fi = voix(figurant(t, 440, 2, { face: 1, s: .5, y: 800, look: [.6, .5], froncer: .6, sourcil: .4, chapeau: COIFFE.casquette }), ['s10b'], t);
      Fi.handR = [150, -560]; Fi.poseR = 'ouverte'; if (lb > B[1] * .5) { Fi.tilt -= .08; Fi.look = [.2, -.2]; }
      const Bj = figurant(t, 760, 3, { face: -1, s: .5, y: 790, look: [-.8, .2], sourire: 1 });
      bijouterieNB(cc, t, { derriere: (c2) => { dessine(c2, Bj); dessine(c2, Fi); }, devant: (c2) => { for (let k = 0; k < 6; k++) F(c2, poly([[460 + k * 26, 482 - k * 3], [520 + k * 26, 482 - k * 3], [520 + k * 26, 470 - k * 3], [460 + k * 26, 470 - k * 3]]), GRIS.blanc, 1.5); } });
    }
  });
  debutFlash(c, t);
}
