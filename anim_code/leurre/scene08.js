// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard montre le grand seau qui brille à côté du moyen : « Un leurre placé juste à côté du grand, pour le faire briller. »
// s08b : trois panneaux : MENU (S, M, L) · FORFAIT (1, 5, 20 Go) · CAFÉ (petit, moyen, grand), le milieu entouré de pointillés.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 150, 950); voix(R, ['s08a'], t); R.face = 1; R.look = [.8, 0]; M.face = -1; M.look = [-.8, 0]; if (la >= 0) { R.handR = [200, -560]; R.poseR = 'pointe'; R.sourire = .5; }
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => cinemaNB(cc, t, { brille: 1 }), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0]]); partoutNB(cc, t, seg(lb, 0, B[1] * .9)); });
  debutFlash(c, t);
}
