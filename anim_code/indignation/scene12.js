// SCÈNE 12 — Plans 22-23 (TV + héros). Le mouton trouve le rectificatif, presque invisible : « Pourquoi la correction attire-t-elle moins les regards ? »
// Le renard montre deux thermomètres, émotion et certitude : « Une émotion forte n'augmente pas la certitude. »
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 160, 920); voix(R, ['s12b'], t); voix(M, ['s12a'], t);
  if (la >= 0 && lb < 0) { M.lean = .08; M.look = [-.5, .6]; M.handR = [-120, -500]; M.poseR = 'pointe'; M.froncer = .6; }
  if (lb >= 0) { R.handR = [300, -620]; R.poseR = 'pointe'; M.look = [-.6, -.2]; }
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { if (lb < -.1) { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); une(cc, 520, 400, 1.6, 'LES ÉCHOS DU MARCHÉ', 0, { taille: 24, rectif: true }); } else thermometres(cc, t, seg(lb, 0, 1)); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
