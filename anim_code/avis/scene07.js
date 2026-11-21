// SCÈNE 07 — TV + héros. 
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
const X = ((cc, t, u) => aubergeNB(cc, t, { pages: 5, derriere: (c2) => { dessine(c2, voix(VOYAGEUR(t, 520, { face: 1, look: [.7, .4], sourire: 1.1, handR: [120, -520], poseR: 'pointe' }), ['s07a'], t)); dessine(c2, AUBERGISTE(t, 900, { face: -1, look: [-.6, 0], sourire: 1 })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 150, 300); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourire = .4; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => X(cc, t, seg(la, 0, A[1])), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
