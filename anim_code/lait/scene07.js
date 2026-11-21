// SCÈNE 07 — Plans 12-13 (TV + héros). À la sortie, une cliente au panier débordant (biscuits, savon… et un vase !) : « Je venais pour du pain… et j’ai pris des biscuits, du savon, et un vase ! »
// Le mouton (en couleur), entre deux rayons : « Donc le chemin est fait exprès pour me faire acheter ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  const [R, M] = herosTV(t, 170, 330); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourire = .5; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => libreServiceNB(cc, t, { derriere: (c2) => { const C2 = voix(CLIENTE(t, 720, { face: -1, look: [-.6, -.2], sourire: .9, sourcil: .8, handR: [-90, -480], poseR: 'poing' }), ['s07a'], t); dessine(c2, C2); const h = mainF(C2, 1); panierNB(c2, h[0], h[1] + 40, .8); for (let j = 0; j < 4; j++) produitNB(c2, h[0] - 30 + j * 18, h[1] - 6, .6, j); F(c2, smooth([[h[0] + 20, h[1] - 10], [h[0] + 44, h[1] - 10], [h[0] + 50, h[1] - 50], [h[0] + 40, h[1] - 80], [h[0] + 46, h[1] - 96], [h[0] + 18, h[1] - 96], [h[0] + 24, h[1] - 80], [h[0] + 14, h[1] - 50]]), GRIS.blanc, 2.5); } }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
