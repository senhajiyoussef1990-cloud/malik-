// SCÈNE 01 — Plans 01-02 (salon). Le mouton brandit un manteau bleu sur son cintre, étiquette « 200 € » barré, « 100 € » en rouge : « Regarde ! Ce manteau était à deux cents euros, et il est à cent. Moins cinquante pour cent ! »
// Le renard, sa tasse à la main : « Il était vraiment à deux cents euros ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.handR = [-200, -560]; M.poseR = 'poing'; M.look = [-.3, -.2]; M.sourire = 1;
  R.x = 345; R.look = [.9, .1]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; M.sourire = .4; }
  c.save(); cam(c, t, [[0, 600, 430, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, sac: 1, t }) }, (cc) => { const a = mainScene(M, 1); manteauCouleur(cc, a[0], a[1] + 150, .55, 0); });
  c.restore();
}
