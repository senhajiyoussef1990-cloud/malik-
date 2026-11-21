// SCÈNE 11 — Plans 20-21 (TV + héros). Devant la confiserie, le mouton (en couleur) : « Donc on ne choisit pas vraiment, on compare ce qu’on nous montre ? »
// Le renard montre le tableau des prix : « Exactement. Et celui qui montre a déjà choisi pour toi. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 950, 150); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.froncer = .6; M.sourcil = .9; }
  if (lb >= 0) { R.handR = [200, -700]; R.poseR = 'pointe'; R.sourcil = .5; R.look = [-.6, -.5]; M.look = [.9, -.4]; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.0], [DUREE, 540, 400, 1.03]], (cc) => cinemaNB(cc, t, { brille: 1 }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
