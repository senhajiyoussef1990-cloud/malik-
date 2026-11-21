// SCÈNE 11 — Plans 20-21 (TV + héros). Devant le rayon de céréales, le mouton (en couleur) : « Donc la phrase vient d'abord de ceux qui vendent les céréales ? »
// Le renard hausse les épaules, mains ouvertes : « Elle les arrange bien, en tout cas. Ça ne la rend ni vraie ni fausse. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 640, 400); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'pointe'; M.froncer = .5; M.sourcil = .9; }
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.handL = [lerp(-104, -170, k), lerp(-440, -540, k)]; R.handR = [lerp(104, 170, k), lerp(-440, -540, k)]; R.poseL = R.poseR = 'ouverte'; R.tilt += .08 * k; R.sourcil = .6; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 540, 430, 1.12], [DUREE, 540, 420, 1.15]], (cc) => rayonNB(cc, t, {}), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
