// SCÈNE 01 — Plans 01-02 (salon). Le mouton revient du cinéma, un énorme seau de pop-corn « GRAND » dans les bras : « Au cinéma, j’ai pris le grand pop-corn. Pour cinquante centimes de plus, c’était évident ! »
// Le renard, amusé : « Tu voulais un grand pop-corn en entrant ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.handR = [-60, -520]; M.poseR = 'poing'; M.handL = [-130, -520]; M.poseL = 'poing'; M.look = [-.5, 0]; M.sourire = 1;
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.sourire = .6; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.38], [B[0], 520, 410, 1.36], [DUREE, 520, 410, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, ticket: 1, t }) }, (cc) => { const a = mainScene(M, 1), b = mainScene(M, -1); popcornCouleur(cc, (a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 60, .75); });
  c.restore();
}
