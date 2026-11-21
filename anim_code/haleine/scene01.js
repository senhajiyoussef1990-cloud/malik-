// SCÈNE 01 — Plans 01-02 (salon). Le mouton se gargarise bruyamment, flacon vert « HALEINE FRAÎCHE » à la main : « Je me rince la bouche trois fois par jour. On ne sait jamais ! »
// Le renard, sa tasse sur la table, plisse les yeux : « On ne sait jamais quoi, au juste ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handR = [-80, -560]; M.poseR = 'poing'; M.look = [-.3, -.4]; M.sourire = .5;
  if (t < A[0]) { M.tilt -= .2; M.look = [0, -1]; M.bob += Math.abs(Math.sin(t * 18)) * 4; }
  R.x = 345; R.look = [.9, .2]; R.lid = .55;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .4; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, verre: 1, t }) }, (cc) => { const a = mainScene(M, 1); flaconBouche(cc, a[0] - 6, a[1] + 30, .45, -.15, .6); if (t < A[0]) for (let k = 0; k < 4; k++) { const u = (t * 2 + k / 4) % 1; F(cc, ell(M.x - 30 + Math.sin(u * 9) * 10, M.y - 370 - u * 50, 5 - u * 3, 5 - u * 3), 'rgba(200,240,220,.8)', 1); } });
  c.restore();
}
