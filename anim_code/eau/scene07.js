// SCÈNE 07 — Plans 12-13 (TV + héros). Au Grand Hôtel, une cliente repousse la carafe du serveur d’un geste dégoûté : « L’eau du robinet ? Quelle horreur. Je ne bois que de l’eau de source. »
// Le mouton (en couleur), à voix basse : « Mais son eau du robinet est contrôlée, non ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 170, 330); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourcil = .5; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => { restoNB(cc, t, { derriere: (c2) => { const Cl = voix(CLIENTE(t, 640, { face: 1, look: [.6, -.3], froncer: .9, sourcil: 1, handR: [140, -600], poseR: 'ouverte', s: .46, y: 700 }), ['s07a'], t); if (la >= 0) Cl.tilt -= .08; dessine(c2, Cl); const S = SERVEUR(t, 900, { face: -1, look: [-.6, .1], handR: [-90, -560], poseR: 'poing' }); dessine(c2, S); const h = mainF(S, 1); F(c2, smooth([[h[0] - 20, h[1]], [h[0] + 20, h[1]], [h[0] + 26, h[1] - 60], [h[0] + 6, h[1] - 90], [h[0] - 6, h[1] - 90], [h[0] - 26, h[1] - 60]]), 'rgba(230,230,230,.75)', 3); } }); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
