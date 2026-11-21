// SCÈNE 07 — Plans 12-13 (TV + héros). Dans son salon, le client découvre un énième colis, la carte de refus oubliée sur la commode : « Encore un disque que je n’ai pas choisi… J’ai encore oublié la carte ! »
// Le mouton (en couleur), devant la pile de disques : « Donc il paie parce qu’il a oublié de dire non ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  const [R, M] = herosTV(t, 950, 830); voix(M, ['s07b'], t); R.face = -1; M.face = -1;
  R.look = [-.9, 0]; M.look = [-.9, 0];
  if (lb >= 0) { M.handR = [140, -620]; M.poseR = 'ouverte'; M.sourcil = 1; M.look = [-.8, -.2]; R.sourire = .5; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.0], [DUREE, 560, 420, 1.04]], (cc) => salonClient(cc, t, { pile: 9, factures: 6, derriere: (c2) => { const C2 = voix(CLIENT(t, 360, { face: 1, look: [.5, .5], froncer: .8, sourcil: 1, handL: [-60, -720], poseL: 'ouverte', handR: [100, -540], poseR: 'poing' }), ['s07a'], t); dessine(c2, C2); const h = mainF(C2, 1); disqueNB(c2, h[0] + 10, h[1] + 10, .5, .2); } }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
