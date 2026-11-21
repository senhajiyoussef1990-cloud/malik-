// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : devant la nouvelle affiche « L’HOMME LIBRE », le renard : « Exactement. Même produit, nouveau personnage. »
// s08b : gros plan : la main tatouée, la cigarette, les grands espaces derrière.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 160, 950); voix(R, ['s08a'], t); R.face = 1; R.look = [.8, 0]; M.face = -1; M.look = [-.8, 0]; if (la >= 0) { R.handR = [200, -640]; R.poseR = 'pointe'; R.sourire = .6; }
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => afficheLibre(cc, t, 1), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 580, 420, 1.1]]); if (lb < B[1] * .45) { grandsEspacesNB(cc, t); cavalier(cc, t, lerp(-200, 560, seg(lb, 0, B[1] * .45)), 760, .9); } else mainTatouee(cc, t, seg(lb, B[1] * .45, B[1])); });
  debutFlash(c, t);
}
