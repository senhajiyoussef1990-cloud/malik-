// SCÈNE 06 — Plans 10-11 (TV). Le présentateur entre sous le projecteur, en blouse et grosses lunettes ; le public redresse la tête.
// Une spectatrice chuchote à sa voisine : « Il a l'air de savoir de quoi il parle. »
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0], ent = ease(seg(la, 0, 1));
    cam(cc, t, [[0, 540, 405, 1.0], [B[0] - .1, 540, 405, 1.0], [B[0] + .4, 300, 600, 1.6], [DUREE, 300, 600, 1.6]]);
    auditoriumNB(cc, t, { rideau: 1, diplome: 1, pupitre: 1, dossiers: 8, spot: ent });
    const O = ORATEUR(t, lerp(1100, 380, ent), { face: 1, look: [.3, .2], sourire: 1, habit: habitBlouse, chapeau: LUNETTES(true) }); if (ent < 1) marche(O, t, 7); dessine(cc, O);
    if (lb >= 0) { const S1 = figurant(t, 260, 1, { s: .5, y: 900, face: 1, look: [.9, 0], lean: .1, chapeau: COIFFE.foulard }); voix(S1, ['s06b'], t); S1.talk *= .5; S1.handL = [-40, -640]; S1.poseL = 'ouverte'; dessine(cc, S1);
      dessine(cc, figurant(t, 380, 4, { s: .5, y: 900, face: -1, look: [.9, 0], sourcil: .8, chapeau: COIFFE.foulard })); }
  });
  debutFlash(c, t);
}
