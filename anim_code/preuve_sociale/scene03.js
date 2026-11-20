// SCÈNE 03 — Plan 05. « Entrons dans cette drôle de boutique. » Le renard tourne le bouton du poste ; halo de l'écran ;
// la caméra plonge dans l'image.
const T1 = L.s03a[0], D1 = L.s03a[1];
const T_ON = T1 + D1 * .55, Z0 = T1 + D1 + .4, ZD = 1.5, DUREE = Z0 + ZD + .05;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s03a'], t), M = moutonBase(t), la = t - T1;
  const u = ease(seg(t, .1, T1 + .6)), on = clamp((t - T_ON - .15) / .5);
  R.x = lerp(430, 350, u); if (u > 0 && u < 1) { R.walk = t * 9; R.bob = Math.abs(Math.sin(t * 9)) * 7; }
  R.look = [-.8, 0];
  if (la >= 0 && t < T_ON - .4) { R.handR = [170, -700]; R.poseR = 'ouverte'; R.sourcil = .7; R.look = [.6, -.1]; R.tilt = wob(tq, .8, .05); }   // « drôle de boutique »
  if (t >= T_ON - .4) { const k = ease(seg(t, T_ON - .4, T_ON)); R.handL = [lerp(-104, -118, k), lerp(-440, -548, k)]; R.poseL = 'pointe'; R.lean = -.05 * k; R.look = [-1, .4]; R.lid = .55;
    if (t > T_ON) R.handL[0] += Math.sin((t - T_ON) * 10) * 6 * (t < T_ON + .4); }   // il tourne le bouton
  if (on > 0) { R.look = [-1, .2]; R.sourcil = .4; }
  M.x = 600; M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing'; M.look = [-.9, .1]; M.froncer = .3; M.sourire = .3;
  if (on > 0) { M.lean = .05 * on; M.look = [-1, .3]; M.oreille = .2 * on; M.froncer = 0; M.sourire = .6; }
  c.save();
  const de = [380, 430, 1.32], z = ease(seg(t, Z0, Z0 + ZD));
  if (z > 0) camEcran(c, z, de);
  else cam(c, t, [[0, 500, 400, 1.08], [T1, 420, 400, 1.24], [T_ON - .5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: on > .3 ? emission(0, { marchand: true }) : null }, (cc) => { const a = mainScene(M, 1), b = mainScene(M, -1); chapeauMode(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, .44, 0); });
  c.restore();
  flash(c, ease(seg(t, DUREE - .3, DUREE)));
}
