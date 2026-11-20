// SCÈNE 11 — Plans 20-21 (TV + héros). Au café, devant le juke-box qui joue encore, le mouton (en couleur) se gratte la tête : « Donc mon goût a été fabriqué par la répétition ? »
// Le renard, la main ouverte : « En partie. Entendre souvent, c'est presque aimer. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 560, 330); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handL = [-30, -760]; M.poseL = 'pointe'; M.froncer = .6; M.sourcil = .9; M.tilt += .06; }
  if (lb >= 0) { R.handR = [150, -600]; R.poseR = 'ouverte'; R.sourire = .6; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 600, 430, 1.12], [DUREE, 600, 420, 1.15]], (cc) => cafeNB(cc, t, {}), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
