// SCÈNE 13 — la morale du renard. 
const A = L.s13a, DUREE = A[0] + A[1] + .9;
const X = ((cc, t, u) => { studio38NB(cc, t, {}); machineRires(cc, 920, 790, .45, t, { on: 0 }); });
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [-150, -620]; R.poseL = 'ouverte';
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => X(cc, t, 1), (cc) => { heros(cc, R, M);  });
  debutFlash(c, t);
}
