// SCÈNE 03 — Plan 05. « Au fond d'une vallée, les paroles voyagent étrangement. » On plonge dans l'écran : la vallée.
const A = L.s03a, ZD = 1.1, DUREE = A[0] + A[1] + .3, Z0 = DUREE - ZD - .05;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .15) / .4);
  R.x = 360; R.handL = [-150, -560]; R.poseL = 'ouverte'; R.look = [-1, .3]; M.x = 600; M.look = [-1, .2]; M.oreille = .2;
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 450, 1.25];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 420, 430, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: (cc, tt) => valleeNB(cc, tt, {}), derriere: (cc) => hautParleurs(cc, 905, 450, t, 0) });
  c.restore(); flash(c, ease(seg(t, DUREE - .25, DUREE)));
}
