// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : devant la balance « J’AI REÇU / JE DOIS », le renard : « Peu importe. Recevoir crée une dette. Et on n’aime pas avoir de dettes. »
// s08b : le titre tombe : « RÈGLE DE RÉCIPROCITÉ ».
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 160, 950); voix(R, ['s08a'], t); R.face = 1; R.look = [.8, 0]; M.face = -1; M.look = [-.8, 0]; if (la >= 0) { R.handR = [200, -640]; R.poseR = 'pointe'; R.sourire = .4; }
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => balanceDette(cc, t, seg(la, .3, A[1] * .7)), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0]]); balanceDette(cc, t, 1, { titre: seg(lb, .1, .7) }); });
  debutFlash(c, t);
}
