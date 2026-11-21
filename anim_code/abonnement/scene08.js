// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : devant la pile de factures, le renard : « Exactement. Le silence vaut un oui. Et on oublie souvent. »
// s08b : « L’OPTION PAR DÉFAUT » : la case « Je continue chaque mois » est déjà cochée.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 950, 830); voix(R, ['s08a'], t); R.face = -1; M.face = -1; R.look = [-.8, .2]; M.look = [-.9, 0]; if (la >= 0) { R.handR = [200, -560]; R.poseR = 'pointe'; R.sourire = .4; }
    nbEtCouleur(c, t, [[0, 540, 420, 1.0]], (cc) => salonClient(cc, t, { pile: 9, factures: 6 }), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0]]); caseCochee(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
