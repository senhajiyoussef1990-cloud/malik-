// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard montre la réclame des aisselles lisses : « Oui. On a appris aux gens à avoir honte d’eux-mêmes. »
// s08b : « LA MODE DES ANNÉES FOLLES » : 1920 → 1930, les jupes raccourcissent… « et les jambes aussi lisses ? »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 160, 950); voix(R, ['s08a'], t); R.face = 1; R.look = [.8, 0]; M.face = -1; M.look = [-.8, 0]; M.froncer = .4; if (la >= 0) { R.handR = [200, -640]; R.poseR = 'pointe'; }
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => reclameAisselles(cc, t, 1), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 600, 420, 1.08]]); jupesNB(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
