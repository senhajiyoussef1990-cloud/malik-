// SCÈNE 03 — Plan 05. « Observons la force d'un simple cadrage. » Les deux photos se rapprochent dans l'écran ; on plonge dans la place.
const A = L.s03a, ZD = 1.1, DUREE = A[0] + A[1] + .3, Z0 = DUREE - ZD - .05;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .15) / .4), rap = ease(seg(t, .3, Z0));
  R.x = 360; R.handL = [-104, -440]; R.look = [-1, .3]; M.x = 600; M.look = [-1, .2]; M.oreille = .2; M.froncer = .5;
  const ecran = (cc, tt) => { cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); photo(cc, lerp(250, 380, rap), 400, 400, 'fete', -.05); photo(cc, lerp(830, 700, rap), 400, 380, 'flaque', .05); };
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 450, 1.25];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 420, 430, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran });
  c.restore();
  flash(c, ease(seg(t, DUREE - .25, DUREE)));
}
