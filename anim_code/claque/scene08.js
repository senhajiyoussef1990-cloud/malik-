// SCÈNE 08 — TV + héros, puis TV. 
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
const XA = ((cc, t, u) => theatreNB(cc, t, { claque: [3, 6, 12, 15, 24], etiquettes: 1, app: 1 })), XB = ((cc, t, u) => { coulisses(cc, t, 1); dessine(cc, figurant(t, 700, 4, { s: .48, y: 790, face: -1, look: [-.6, 0], handR: [-120, -560], poseR: 'ouverte' })); dessine(cc, CHEF(t, 360, { face: 1, look: [.6, 0], sourire: 1.1, handR: [120, -560], poseR: 'ouverte' })); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 150, 300); voix(R, ['s08a'], t); R.face = 1; M.face = 1; R.look = [.8, 0]; M.look = [.8, 0]; if (la >= 0) { R.handR = [200, -640]; R.poseR = 'pointe'; R.sourire = .5; }
    nbEtCouleur(c, t, [[0, 600, 405, 1.08]], (cc) => XA(cc, t, 1), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
