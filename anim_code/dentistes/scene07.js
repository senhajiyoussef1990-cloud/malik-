// SCÈNE 07 — TV + héros. 
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
const X = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.fillStyle = '#9a968e'; cc.fillRect(0, 620, W, H - 620); dessine(cc, voix(DENTISTE(t, 700, { face: -1, look: [-.6, 0], sourcil: .5, handR: [-120, -600], poseR: 'ouverte' }), ['s07a'], t)); for (let k = 0; k < 6; k++) poudreNB(cc, 860 + (k % 3) * 70, 400 + Math.floor(k / 3) * 100, .6, ['ÉCLAT', 'BLANCHOR', 'DENTIL'][k % 3]); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 150, 300); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourire = .4; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => X(cc, t, seg(la, 0, A[1])), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
