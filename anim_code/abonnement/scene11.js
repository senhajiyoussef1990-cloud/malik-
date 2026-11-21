// SCÈNE 11 — Plans 20-21 (TV + héros). Devant l’écran de l’essai gratuit, le mouton (en couleur) : « Donc l’essai gratuit, c’est un pari sur mon oubli ? »
// Le renard : « Souvent, oui. Et l’entreprise gagne quand tu oublies. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 950, 130); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.sourcil = .9; M.froncer = .5; }
  if (lb >= 0) { R.handR = [150, -660]; R.poseR = 'pointe'; R.sourcil = .5; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.0], [DUREE, 540, 400, 1.03]], (cc) => essaiClic(cc, t, 1), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
