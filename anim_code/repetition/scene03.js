// SCÈNE 03 — Plan 05. « Visitons l'atelier des messages familiers. » Le renard allume le poste ; la caméra plonge dans l'écran.
const A = L.s03a, ZD = 1.1, T_ON = .6, DUREE = A[0] + A[1] + .3, Z0 = DUREE - ZD - .05;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - T_ON) / .4);
  R.x = 350; const k = ease(seg(t, 0, T_ON)); R.handL = [lerp(-104, -118, k), lerp(-440, -548, k)]; R.poseL = 'pointe'; R.look = [-1, .4]; if (t > T_ON) { R.handL = [-104, -440]; R.poseL = 'repos'; R.sourcil = .7; R.look = [-1, .2]; }
  M.x = 620; M.look = [-1, .2]; M.lean = .05 * on; M.oreille = .2 * on; M.sourire = .5;
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 440, 1.3];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 400, 420, 1.2], [T_ON, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: on > .3 ? (cc, tt) => imprimerieNB(cc, tt, { vit: .8, pile: 2 }) : null }, (cc) => radioJoue(cc, t, .4));
  c.restore();
  flash(c, ease(seg(t, DUREE - .25, DUREE)));
}
