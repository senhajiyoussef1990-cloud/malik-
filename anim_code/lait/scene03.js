// SCÈNE 03 — Plan 05. « Direction l’Amérique, en mille neuf cent seize. » Le poste s’allume sur une épicerie d’autrefois, son comptoir et ses étagères jusqu’au plafond ; on plonge dans l’écran.
const A = L.s03a, ZD = 1.2, DUREE = A[0] + A[1] + .3, Z0 = DUREE - ZD - .05;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .15) / .4);
  R.x = 345; R.handL = [-150, -560]; R.poseL = 'ouverte'; R.look = [-1, .3]; M.x = 718; M.look = [-1, .2]; M.oreille = .2;
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 450, 1.25];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 420, 430, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: (cc, tt) => { comptoirNB(cc, tt); plaqueEpoque(cc, 'Amérique — 1916', 1); }, derriere: (cc) => tablePetitDej(cc, { tasse: 1, sac: 1, lait: 1, t }) });
  c.restore(); flash(c, ease(seg(t, DUREE - .25, DUREE)));
}
