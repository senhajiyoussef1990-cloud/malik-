// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard montre la réclame du magazine : « Toujours demoiselle d'honneur… jamais la mariée. — Ses amies le savent. Elle, non. » : « Oui. Et personne n'ose le lui dire. Donc il faut acheter le flacon. »
// s08b : à la noce, les invités se détournent et se cachent derrière la main quand la demoiselle passe.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 160, 950); voix(R, ['s08a'], t); R.face = 1; R.look = [.8, 0]; M.face = -1; M.look = [-.8, 0]; if (la >= 0) { R.handR = [200, -640]; R.poseR = 'pointe'; R.sourire = .6; }
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => reclameMagazine(cc, t, seg(la, 0, A[1])), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 420, 1.05]]); detournes(cc, t, seg(lb, 0, B[1])); dessine(cc, marche(DEMOISELLE(t, lerp(1100, -100, seg(lb, 0, B[1] + .5)), { face: -1, look: [-.6, .5], froncer: .8 }), t, 5)); });
  debutFlash(c, t);
}
