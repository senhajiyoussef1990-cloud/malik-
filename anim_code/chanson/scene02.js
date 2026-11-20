// SCÈNE 02 — Plans 03-04 (salon). Le mouton compte sur ses doigts, le regard au plafond : « Partout ! À la radio, au café, au marché… » — trois petites bulles s'allument : un poste, une tasse, un panier.
// Le renard pointe la radio du buffet puis le poste de télévision : « Voilà la clé. Allons voir d'où viennent ces refrains. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.3, -.8]; M.sourire = .5;
  const n = Math.min(3, Math.floor(seg(la, 0, A[1] * .9) * 3) + (la >= 0 ? 1 : 0));
  if (la >= 0 && lb < 0) { M.handL = [-60, -620]; M.poseL = n >= 2 ? 'ouverte' : 'pointe'; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .6; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { radioJoue(cc, t, .8); tablePetitDej(cc, { tasse: 1, disque: 1, pochette: 1, t }); } }, (cc) => { if (la >= 0 && lb < 0) for (let k = 0; k < n; k++) bulle(cc, 600 + k * 150, 150 + (k % 2) * 30, ['la radio', 'le café', 'le marché'][k], 1, 20); });
  c.restore();
}
