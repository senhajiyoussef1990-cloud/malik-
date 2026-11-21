// SCÈNE 01 — salon, la télé zappe ; « c'est quoi, cette chaîne ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.look = [-.5, .2]; M.sourire = .6; M.handL = [-150, -620]; M.poseL = 'pointe';
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); M.handL = [-104, -440]; M.poseL = 'ouverte'; R.lid = .3; R.sourcil = .6 * k; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .8; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 470, 440, 1.12], [B[0], 480, 430, 1.16], [DUREE, 480, 430, 1.2]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => zap(cc, tt, ORDRE_ZAP, 1.6), derriere: (cc) => tablePetitDej(cc, { tasse: 1, t }) });
  c.restore();
}
