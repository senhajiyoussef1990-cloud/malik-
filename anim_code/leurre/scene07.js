// SCÈNE 07 — Plans 12-13 (TV + héros). Au comptoir du cinéma, le vendeur tapote le seau « MOYEN » : « Je n’ai pas besoin de vendre le moyen. J’ai besoin qu’il existe ! »
// Le mouton (en couleur), devant le tableau des prix : « Donc le moyen pop-corn, c’était un leurre ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  const [R, M] = herosTV(t, 150, 950); voix(M, ['s07b'], t); R.face = 1; M.face = -1;
  R.look = [.9, 0]; M.look = [-.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.handL = [-140, -620]; M.poseL = 'pointe'; M.sourcil = 1; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.0], [DUREE, 540, 420, 1.03]], (cc) => cinemaNB(cc, t, { derriere: (c2) => dessine(c2, voix(VENDEUR(t, 560, { s: .46, y: 600, face: 1, look: [.2, .3], sourire: 1.1, handL: [-130, -400], poseL: 'pointe' }), ['s07a'], t)) }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
