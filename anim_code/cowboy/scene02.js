// SCÈNE 02 — Plans 03-04 (salon). Le mouton, rêveur : « Pour les cow-boys, j’imagine. Des hommes rudes, des grands espaces… »
// Le renard secoue la tête et montre le poste : « Pas du tout. Allons voir la vraie histoire. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.4, -.6]; M.sourire = .7;
  if (la >= 0 && lb < 0) { M.handL = [-160, -660]; M.poseL = 'ouverte'; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .5, 1)); R.tilt += Math.sin(lb * 9) * .04 * (1 - k); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .6; M.look = [-1, -.1]; M.sourire = 0; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, roulee: 1, t }) });
  c.restore();
}
