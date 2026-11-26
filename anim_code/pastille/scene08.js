// SCÈNE 08 — retour au salon (sans réplique) ; le mouton a compris, la morale du renard + le carnet.
const A = L.s08a, B = L.s08b, ZD = 1.0, DUREE = B[0] + B[1] + .7;
const X = ((cc, t, u) => reglagesNotif(cc, t, u));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s08b'], t), M = voix(moutonBase(t), ['s08a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.7, -.1]; M.sourcil = .8; R.x = 345; R.look = [.9, .1];
  if (la >= 0 && lb < 0) { M.handL = [-60, -720]; M.poseL = 'pointe'; M.sourire = .5; }
  if (lb >= 0) { R.handR = [200, -600]; R.poseR = 'ouverte'; R.sourire = .8; M.look = [-.9, 0]; M.sourire = .9; }
  const z = ease(seg(t, 0, ZD)), u = seg(lb, 0, B[1]);
  c.save(); if (z < 1) camEcran(c, 1 - z, [520, 430, 1.3]); else cam(c, t, [[ZD, 520, 430, 1.3], [DUREE, 540, 440, 1.24]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => X(cc, tt, 1), derriere: (cc) => tablePetitDej(cc, { tasse: 1, objet: 1, t }) }, (cc) => {
    if (lb >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui veut', clamp(u * 3)], ['que je regarde,', clamp(u * 3 - .6)], ['et pourquoi', clamp(u * 3 - 1.4)], ['maintenant ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore(); flash(c, 1 - ease(seg(t, 0, .25)));
}
