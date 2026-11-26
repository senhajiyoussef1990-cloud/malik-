// SCÈNE 04 — TV + héros : la victime, le mouton réagit.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .4;
const X = ((cc, t, u) => auberge(cc, t, { avant: (c2) => { dessine(c2, voix(AUBERGISTE(t, 820, { face: -1, look: [-.6, 0], sourire: 1, handR: [150, -600], poseR: 'ouverte' }), ['s04a'], t)); addition(c2, 600, 400, .7, 1 + Math.floor(clamp(u * 1.2) * 3.99)); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 150, 330); voix(M, ['s04b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -620]; M.poseR = 'ouverte'; M.sourcil = 1.2; M.froncer = .3; R.look = [.6, .1]; R.sourire = .5; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.15]], (cc) => X(cc, t, seg(la, 0, A[1])), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
