// SCÈNE 01 — Plans 01-02 (salon). Le mouton déplie une vieille affiche : un cow-boy au soleil couchant, « L’HOMME LIBRE » : « Ce cow-boy sur les vieilles affiches, quel symbole de liberté ! »
// Le renard, sa tasse à la main : « Tu sais pour qui cette cigarette était faite, au départ ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.handR = [-80, -560]; M.poseR = 'poing'; M.look = [-.3, .5]; M.sourire = .8;
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; M.sourire = .3; }
  c.save(); cam(c, t, [[0, 600, 430, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, t }) }, (cc) => { const a = mainScene(M, 1); afficheCowboy(cc, a[0] - 20, a[1] + 120, .7, -.08); });
  c.restore();
}
