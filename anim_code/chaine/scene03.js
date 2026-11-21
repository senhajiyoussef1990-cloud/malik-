// SCÈNE 03 — pub, rumeur, astuce ; le mouton comprend
const A = L.s03a, B = L.s03b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s03a'], t), M = voix(moutonBase(t), ['s03b'], t), la = t - A[0], lb = t - B[0];
  R.x = 345; R.look = [.9, .1]; M.x = 718; M.look = [-.9, 0];
  if (lb < 0) { const n = Math.min(2, Math.floor(la / (A[1] / 3))); R.handR = [180, -600]; R.poseR = 'ouverte'; R.handL = [-120, -560 - n * 40]; R.poseL = n > 1 ? 'pointe' : 'ouverte'; R.sourcil = .5; }
  else { M.handL = [-120, -720]; M.handR = [120, -720]; M.poseL = M.poseR = 'ouverte'; M.sourcil = 1; M.froncer = 0; M.look = [-.2, -.2]; R.sourire = 1; R.look = [.9, 0]; }
  c.save(); cam(c, t, [[0, 460, 430, 1.14], [B[0], 520, 430, 1.2], [DUREE, 540, 430, 1.24]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => zap(cc, tt, ['torches', 'martiens', 'cowboy'], 1.4), derriere: (cc) => tablePetitDej(cc, { tasse: 1, t }) });
  c.restore();
}
