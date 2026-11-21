// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : devant le rayon, le renard compte sur ses doigts : « Le chemin, les couleurs, la hauteur des étagères. Rien n’est au hasard. »
// s08b : sur le plan, trois étiquettes s’allument au fond du magasin, loin de l’entrée : LAIT · PAIN · ŒUFS.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 640, 400); voix(R, ['s08a'], t); R.face = -1; R.look = [-.8, 0]; M.face = 1; M.look = [.8, 0]; if (la >= 0) { R.handR = [150, -600]; R.poseR = Math.floor(la * 1.3) % 2 ? 'pointe' : 'ouverte'; R.sourire = .5; }
    nbEtCouleur(c, t, [[0, 600, 405, 1.12]], (cc) => libreServiceNB(cc, t), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 800, 220, 1.3]]); planMagasin(cc, t, 1, { fond: lb > B[1] * .6 ? 'ŒUFS' : lb > B[1] * .4 ? 'PAIN' : 'LAIT' }); });
  debutFlash(c, t);
}
