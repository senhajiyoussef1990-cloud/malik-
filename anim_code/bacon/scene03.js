// SCÈNE 03 — Plan 05. « Remontons le temps, jusqu'en Amérique, dans les années vingt. » Le poste s'allume sur une cuisine de 1925 ; on plonge dans l'écran.
const A = L.s03a, ZD = 1.2, DUREE = A[0] + A[1] + .3, Z0 = DUREE - ZD - .05;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .15) / .4);
  R.x = 360; R.handL = [-150, -560]; R.poseL = 'ouverte'; R.look = [-1, .3]; M.x = 620; M.look = [-1, .2]; M.oreille = .2;
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 450, 1.25];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 420, 430, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: (cc, tt) => { cuisineNB(cc, tt, { menu: 'leger', annee: 1925 }); plaqueEpoque(cc, 'Amérique — 1925', 1); } }, (cc) => { gueridon(cc, 545, 660, .55); assiette(cc, 535, 652, .36, { fumee: t }); });
  c.restore(); flash(c, ease(seg(t, DUREE - .25, DUREE)));
}
