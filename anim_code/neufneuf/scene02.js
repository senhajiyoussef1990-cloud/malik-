// SCÈNE 02 — Plans 03-04 (salon). Le mouton, sûr de son calcul : « Oui, mais ça fait neuf euros, pas dix. C’est moins cher, non ? »
// Le renard tapote sa tempe, puis montre le poste : « C’est ce que ton œil croit. Allons voir pourquoi. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, 0]; M.sourire = .6;
  if (la >= 0 && lb < 0) { M.handL = [-120, -560]; M.poseL = 'ouverte'; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, B[1] * .45, B[1] * .45 + .5)); R.handR = k < .1 ? [60, -780] : [96, -400]; R.poseR = 'pointe'; R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .7; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, grillepain: 1, t }) });
  c.restore();
}
