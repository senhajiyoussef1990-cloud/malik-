// SCÈNE 02 — Plans 03-04 (salon). Le mouton, sûr de lui, compte les siècles sur ses doigts : « Les Japonais en mangent depuis des siècles, non ? »
// Le renard secoue doucement la tête et montre le poste : « Pas de celui-là. Allons voir ça de près. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.7, 0]; M.sourire = .4;
  if (la >= 0 && lb < 0) { const k = ease(seg(la, .2, .6)); M.handL = [lerp(-104, -60, k), lerp(-366, -600, k)]; M.poseL = 'pointe'; M.sourcil = .6; M.look = [-.7, -.3]; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.tilt += Math.sin(lb * 9) * .05 * (lb < .8); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { barquetteSaumon(cc, 965, 480, .5, .05); tablePetitDej(cc, { tasse: 1, sushi: 1, t }); } });
  c.restore();
}
