// SCÈNE 03 — Plan 05. « Regardons comment naît une rumeur. » Le journal s'approche de l'écran lumineux ; on plonge dans le village.
const A = L.s03a, ZD = 1.1, DUREE = A[0] + A[1] + .3, Z0 = DUREE - ZD - .05;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .2) / .4);
  R.x = 340; R.handL = [-104, -440]; R.look = [-1, .3]; R.handR = [150, -560]; R.poseR = 'ouverte';
  M.x = 560; M.look = [-1, .2]; M.oreille = .2 * on; M.froncer = .7;
  const j = ease(seg(t, .2, Z0));
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [340, 450, 1.3];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 400, 420, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: (cc, tt) => placeNB(cc, tt, { nuit: .8 }) }, (cc) => {
    const a = mainScene(M, -1); journal(cc, lerp(a[0] + 60, ECRAN[0], j), lerp(a[1] - 50, ECRAN[1], j), lerp(.6, .3, j), { rot: j * 3 });   // le papier aspiré par l'écran
  });
  c.restore();
  flash(c, ease(seg(t, DUREE - .25, DUREE)));
}
