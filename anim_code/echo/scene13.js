// SCÈNE 13 — Plan 24 (TV + héros). Le renard s'adresse à la place, encourageant le doute bienveillant : « Écouter une contradiction n'est pas changer de camp. »
const A = L.s13a, DUREE = A[0] + A[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const [R, M] = herosTV(t, 880, 1000); voix(R, ['s13a'], t); R.face = -1; R.look = [.7, 0]; R.handR = [200, -620]; R.poseR = 'ouverte'; M.face = -1; M.look = [.7, 0]; M.sourire = .8;
  nbEtCouleur(c, t, [[0, 600, 460, 1.1]], (cc) => { placeNB(cc, t, {}); for (let k = 0; k < 6; k++) dessine(cc, figurant(t, 100 + k * 110, k + 1, { s: .44, y: 800, face: 1, look: [.9, 0], sourire: .5, chapeau: [COIFFE.casquette, COIFFE.foulard, COIFFE.toque][k % 3] })); dessine(cc, FACTRICE(t, 760, { face: -1, sourire: 1 })); }, (cc) => heros(cc, R, M));
}
