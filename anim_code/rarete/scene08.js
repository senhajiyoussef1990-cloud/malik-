// SCÈNE 08 — TV + héros, puis TV. 
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
const XA = ((cc, t, u) => arriereBoutique(cc, t, 1)), XB = ((cc, t, u) => chapellerieNB(cc, t, { vides: 1, pancarte: 1, derriere: (c2) => { const P = marche(CHAPELIER(t, lerp(980, 700, Math.min(1, u * 1.5)), { face: -1, look: [-.5, .3], handR: [-80, -560], poseR: 'poing' }), t, u < .66 ? 6 : 0); dessine(c2, P); const h = mainF(P, 1); for (let k = 0; k < 3; k++) chapeauNB(c2, h[0] - 30 + k * 30, h[1] + 10 - k * 12, .5, k); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 150, 300); voix(R, ['s08a'], t); R.face = 1; M.face = 1; R.look = [.8, 0]; M.look = [.8, 0]; if (la >= 0) { R.handR = [200, -640]; R.poseR = 'pointe'; R.sourire = .5; }
    nbEtCouleur(c, t, [[0, 600, 405, 1.08]], (cc) => XA(cc, t, 1), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
