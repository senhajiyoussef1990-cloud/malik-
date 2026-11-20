// SCÈNE 11 — Plans 20-21 (TV + héros). Dans la biscuiterie, le mouton (en couleur) tient l'ancien et le nouveau paquet côte à côte : « Mais c'est une hausse de prix déguisée ! »
// Le renard pince ses doigts, presque fermés : « Exactement. Un changement trop petit pour qu'on le remarque. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 680, 420); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  M.handL = [-150, -560]; M.handR = [150, -560]; M.poseL = M.poseR = 'poing'; if (la >= 0 && lb < 0) { M.froncer = .8; M.sourcil = 1; }
  if (lb >= 0) { R.handR = [150, -700]; R.poseR = 'pointe'; R.lid = .45; R.sourire = .5; M.look = [.9, -.3]; }
  nbEtCouleur(c, t, [[0, 560, 430, 1.12], [DUREE, 560, 420, 1.16]], (cc) => biscuiterieNB(cc, t, { prix: ['1,40 F', '1,30 F'], derriere: (c2) => dessine(c2, BISCUITIER(t, 200, { face: 1, look: [.8, 0], sourire: .5 })) }),
    (cc) => { heros(cc, R, M); const a = mainScene(M, -1), b = mainScene(M, 1); paquetBiscuits(cc, a[0] - 20, a[1] + 10, .3, { n: 15 }); paquetBiscuits(cc, b[0] + 20, b[1] + 10, .3, { n: 10 }); });
  debutFlash(c, t);
}
