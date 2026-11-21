// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : au laboratoire, le renard montre l’analyse cochée : « Très contrôlée, souvent. Mais une montagne sur une étiquette, ça rassure. »
// s08b : le robinet plonge dans l’ombre ; un grand « ? » se dessine au-dessus.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 160, 420); voix(R, ['s08a'], t); R.face = 1; R.look = [.8, 0]; M.face = 1; M.look = [.8, 0]; if (la >= 0) { R.handR = [200, -640]; R.poseR = 'pointe'; R.sourire = .5; }
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { laboNB(cc, t, 1); bouteilleNB(cc, 900, 120, .5); }, (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 600, 380, 1.15]]); robinetNB(cc, t, { ombre: seg(lb, .2, 1.2) }); });
  debutFlash(c, t);
}
