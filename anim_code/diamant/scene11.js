// SCÈNE 11 — Plans 20-21 (TV + héros). Devant les vitrines de la joaillerie, le mouton (en couleur) : « Donc la règle des deux mois, c'est le vendeur qui l'a écrite ? »
// Le renard montre le diamantaire qui compte ses billets derrière le comptoir : « Exactement. Une norme inventée par celui qui encaisse. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 560, 300); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.froncer = .6; M.sourcil = .9; }
  if (lb >= 0) { R.face = 1; R.handR = [220, -620]; R.poseR = 'pointe'; R.look = [.8, 0]; R.sourcil = .5; M.look = [.9, -.1]; }
  nbEtCouleur(c, t, [[0, 560, 430, 1.12], [DUREE, 580, 420, 1.15]], (cc) => {
    const D = DIAMANTAIRE(t, 860, { face: -1, look: [-.3, .6], sourire: 1, handL: [-60, -560], handR: [40, -560], poseL: 'poing', poseR: 'poing' });
    D.handR[1] += Math.abs(Math.sin(t * 8)) * 10;
    bijouterieNB(cc, t, { derriere: (c2) => dessine(c2, D) });
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
