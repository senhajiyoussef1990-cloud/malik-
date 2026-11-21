// SCÈNE 01 — Plans 01-02 (salon). Sur la table, un panier débordant de baguettes, croissants et fromage ; le mouton, ravi : « En entrant au supermarché, ça sentait le pain chaud. J’ai tout acheté ! »
// Le renard : « Tu avais faim en entrant ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.handL = [-150, -540]; M.poseL = 'ouverte'; M.look = [-.6, .4]; M.sourire = 1;
  if (t < A[0] + A[1] * .4) { M.tilt -= .08; M.look = [0, -.6]; }
  R.x = 345; R.look = [.8, .3]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.sourire = .5; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.38], [B[0], 520, 420, 1.36], [DUREE, 520, 420, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, panier: 1, t }) });
  c.restore();
}
