// SCÈNE 02 — « Le bacon… le diamant… le jus d'orange » : la télé suit le renard
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), lb = t - B[0];
  M.x = 718; M.look = [-.6, 0]; M.sourcil = .6; M.handL = [-130, -560]; M.poseL = 'ouverte';
  R.x = 345; R.look = [.9, .1];
  const k = lb < 0 ? -1 : Math.min(2, Math.floor(lb / (B[1] / 3)));
  if (lb >= 0) { R.look = [-1, -.2]; R.handL = [-260, -640]; R.poseL = 'pointe'; R.sourire = .8; M.look = [-1, -.3]; M.handL = [-104, -440]; }
  const ecran = (cc, tt) => { if (k < 0) zap(cc, tt, ORDRE_ZAP, 1.6); else { ZAP[['bacon', 'diamant', 'orange'][k]](cc, tt); const f = lb - k * B[1] / 3; if (f < .12) zap(cc, 0, [['bacon', 'diamant', 'orange'][k]], 10); } };
  c.save(); cam(c, t, [[0, 470, 430, 1.16], [B[0], 400, 420, 1.2], [DUREE, 380, 420, 1.3]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran, derriere: (cc) => tablePetitDej(cc, { tasse: 1, t }) });
  c.restore();
}
