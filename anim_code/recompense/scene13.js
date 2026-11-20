// SCÈNE 13 — Plan 24 (TV + héros). Le renard désigne la machine au loin, désormais toute petite : « Une surprise n'est pas une obligation. »
const A = L.s13a, DUREE = A[0] + A[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const [R, M] = herosTV(t, 300, 560); voix(R, ['s13a'], t); R.handR = [300, -700]; R.poseR = 'pointe'; R.look = [.9, -.2]; M.face = 1; M.look = [.9, -.2]; M.sourire = .7;
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { feteNB(cc, t, { manege: 160 }); machine(cc, 940, 600, .35, t, { clignote: true }); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
