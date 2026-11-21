// SCÈNE 05 — retour au salon : « Et c'est pour qui ? » — « Même les moutons. » (clin d'œil)
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s05b'], t), M = voix(moutonBase(t), ['s05a'], t), lb = t - B[0];
  R.x = 345; R.look = [.9, .1]; M.x = 718; M.look = [-.8, 0]; M.sourcil = .5; M.handL = [-120, -600]; M.poseL = 'ouverte';
  if (lb >= 0) { M.handL = [-104, -440]; R.handR = [200, -580]; R.poseR = 'ouverte'; R.sourire = 1; if (lb > B[1] * .6) { R.look = [.9, 0]; R.handR = [170, -660]; R.poseR = 'pointe'; M.sourire = .9; M.sourcil = 1; } if (lb > B[1] + .1 && lb < B[1] + .55) R.wink = 1; }
  c.save(); cam(c, t, [[0, 470, 440, 1.14], [B[0], 490, 430, 1.2], [DUREE, 490, 420, 1.28]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => zap(cc, tt, ORDRE_ZAP.slice().reverse(), 1.6), derriere: (cc) => tablePetitDej(cc, { tasse: 1, t }) });
  c.restore(); debutFlash(c, t);
}
