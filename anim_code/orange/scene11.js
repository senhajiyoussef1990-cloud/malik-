// SCÈNE 11 — Plans 20-21 (TV + héros). Dans le verger, devant la montagne de cagettes, le mouton (en couleur) : « Donc le verre du matin, c'est une idée de vendeurs d'oranges ? »
// Le renard montre les cagettes : « Une idée pour écouler un stock, devenue une habitude. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 760, 300); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.froncer = .6; M.sourcil = .9; }
  if (lb >= 0) { R.handL = [-230, -620]; R.poseL = 'pointe'; R.look = [.6, .2]; R.sourcil = .5; M.look = [.4, .3]; }
  nbEtCouleur(c, t, [[0, 540, 430, 1.12], [DUREE, 540, 420, 1.15]], (cc) => vergerNB(cc, t, { cagettes: 9 }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
