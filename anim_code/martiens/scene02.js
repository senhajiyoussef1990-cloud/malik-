// SCÈNE 02 — Plans 03-04 (salon). Le mouton mime la fuite, bras en l'air : « Tout le monde le raconte ! Les gens fuyaient les Martiens ! »
// Le renard allume la radio du buffet (ondes), puis montre le poste : « Écoutons l'émission… et ce qu'on en a dit après. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, -.2];
  if (la >= 0 && lb < 0) { const w = Math.sin(la * 8); M.handL = [-150, -760 + w * 30]; M.handR = [60, -760 - w * 30]; M.poseL = M.poseR = 'ouverte'; M.sourcil = 1; M.bob += Math.abs(w) * 6; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .6; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { radioJoue(cc, t, lb >= 0 ? 1 : 0); tablePetitDej(cc, { tasse: 1, journal: 1, livre: 1, t }); } });
  c.restore();
}
