// SCÈNE 11 — Plans 20-21 (TV + héros). Au bar à sushis, le mouton (en couleur) regarde défiler les assiettes : « Donc le saumon des sushis, c'est une campagne de vente ? »
// Le renard compte sur ses doigts : « Oui. Un produit refusé, rebaptisé, puis adopté. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 700, 400); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.look = [.3, .6]; M.handR = [150, -560]; M.poseR = 'ouverte'; M.sourcil = .9; }
  if (lb >= 0) { const n = Math.floor(seg(lb, 0, B[1]) * 3); R.handR = [150, -640]; R.poseR = n >= 2 ? 'ouverte' : 'pointe'; R.sourcil = .5; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 540, 430, 1.12], [DUREE, 540, 420, 1.15]], (cc) => barNB(cc, t, { tapis: 1, sushis: 8, prix: '100 ¥' }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
