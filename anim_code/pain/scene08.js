// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard se tapote le museau : « Son nez a fait les courses à sa place. »
// s08b : dans la rue, d’autres boutiques ouvrent leurs portes aux odeurs : CHAUSSURES (cuir), VÊTEMENTS (vanille).
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 640, 400); voix(R, ['s08a'], t); R.face = -1; R.look = [-.8, 0]; M.face = 1; M.look = [.8, 0]; if (la >= 0) { R.handR = [40, -720]; R.poseR = 'pointe'; R.sourire = .7; }
    nbEtCouleur(c, t, [[0, 600, 405, 1.12]], (cc) => grandMagasinNB(cc, t, { four: 1, odeur: 1 }), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0]]); boutiquesOdeurs(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
