// SCÈNE 14 — Plan 25. « Les faits reprennent leur place. » Le village se dissout dans l'écran ; zoom arrière jusqu'au salon.
const A = L.s14a, ZD = 1.3, DUREE = A[0] + A[1] + .6, Z0 = A[0] + A[1] * .35;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const village = (cc, tt) => placeNB(cc, tt, { nuit: 0 });
  if (t < Z0) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 430, 1.1], [Z0, 540, 420, 1.0]]); village(cc, t); }); debutFlash(c, t); return; }
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-.8, .2]; M.x = 640; M.look = [-1, .2]; M.sourire = .6;
  c.save(); camEcran(c, 1 - z, [540, 405, 1.05]); dessineSalon(c, t, R, M, { tv: 1, ecran: village }); c.restore();
  flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}
