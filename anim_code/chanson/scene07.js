// SCÈNE 07 — Plans 12-13 (TV + héros). Derrière la vitre de la régie, le mouton (en couleur) voit l'animateur glisser l'enveloppe dans sa poche : « Il est payé pour la faire tourner ? »
// Le renard montre le compteur des passages : « Oui. Et les auditeurs croient que c'est un succès. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 330, 190); voix(R, ['s07b'], t); voix(M, ['s07a'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -580]; M.poseR = 'ouverte'; M.sourcil = 1; M.froncer = .6; }
  if (lb >= 0) { R.handR = [240, -720]; R.poseR = 'pointe'; R.look = [.6, -.5]; R.sourcil = .5; M.look = [.7, -.4]; }
  nbEtCouleur(c, t, [[0, 560, 430, 1.12], [DUREE, 560, 430, 1.15]], (cc) => {
    const An = ANIMATEUR(t, 760, { face: -1, look: [-.4, .5], sourire: 1, handR: [-40, -440], poseR: 'poing' });
    studioNB(cc, t, { compteur: 10, notes: 1, derriere: (c2) => { dessine(c2, An); const h = mainF(An, 1); enveloppeBillets(c2, h[0], h[1] - 10, .45, .4, 1); } });
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
