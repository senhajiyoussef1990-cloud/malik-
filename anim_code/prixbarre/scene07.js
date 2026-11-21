// SCÈNE 07 — Plans 12-13 (TV + héros). Un client enfile le manteau devant le miroir, ravi : « Cent francs au lieu de deux cents ? Je le prends tout de suite ! »
// Le mouton (en couleur), près du portant : « Mais le manteau, lui, n’a pas changé du tout ! »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  const [R, M] = herosTV(t, 170, 330); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourire = .5; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => boutiqueNB(cc, t, { etiq: 1, derriere: (c2) => { const C2 = voix(CLIENT(t, 860, { face: 1, look: [.6, -.2], sourire: 1.2, handL: [-60, -620], poseL: 'ouverte' }), ['s07a'], t); dessine(c2, C2); c2.save(); c2.globalAlpha = .9; manteauNB(c2, 860, 640, .9, { col: GRIS.fonce }); c2.restore(); dessine(c2, MARCHAND(t, 620, { face: 1, look: [.6, 0], sourire: 1 })); } }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
