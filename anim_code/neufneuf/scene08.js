// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : devant les étiquettes, le renard : « Elle n’a pas vu un centime de différence. Elle a vu un autre prix. »
// s08b : l’épicier retourne ses étiquettes une à une : 1 F → 0,99 F, 2 F → 1,99 F, 10 F → 9,99 F… Partout, des neuf.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 420, 700); voix(R, ['s08a'], t); R.look = [.8, 0]; M.look = [-.8, 0]; if (la >= 0) { R.handL = [-120, -720]; R.poseL = 'pointe'; R.sourire = .5; }
    nbEtCouleur(c, t, [[0, 540, 405, 1.05]], (cc) => epicerieNB(cc, t, { neuf: 1 }), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 380, 1.05], [DUREE, 540, 340, 1.12]]); epicerieNB(cc, t, { neuf: seg(lb, .2, B[1]), derriere: (c2) => dessine(c2, EPICIER(t, 640, { face: -1, look: [-.3, -.8], sourire: 1, handR: [-60, -760], poseR: 'poing' })) }); });
  debutFlash(c, t);
}
