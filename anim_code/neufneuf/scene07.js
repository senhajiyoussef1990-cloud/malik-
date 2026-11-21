// SCÈNE 07 — Plans 12-13 (TV + héros). Chez Dupont, une cliente ravie montre deux doigts à l’épicier : « Seulement quatre-vingt-dix-neuf centimes ? Alors j’en prends deux ! »
// Le mouton (en couleur), dans un coin de la boutique : « Pour un centime, elle en achète deux ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  const [R, M] = herosTV(t, 150, 300); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourire = .5; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.12], [DUREE, 600, 420, 1.15]], (cc) => epicerieNB(cc, t, { neuf: 1, derriere: (c2) => { dessine(c2, voix(CLIENTE(t, 600, { face: 1, look: [.6, -.2], sourire: 1.2, handR: [100, -680], poseR: 'ouverte' }), ['s07a'], t)); dessine(c2, EPICIER(t, 860, { face: -1, look: [-.6, 0], sourire: 1 })); } }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
