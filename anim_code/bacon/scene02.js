// SCÈNE 02 — Plans 03-04 (salon). L'assiette posée sur le guéridon, le mouton montre la boîte du buffet « RECOMMANDÉ PAR LES MÉDECINS » : « Tout le monde le sait. Même les médecins le disent. »
// Le renard pose sa tasse et se tourne vers le poste : « Justement. Allons voir d'où vient cette idée. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, .1]; M.sourire = .4;
  if (la >= 0) { const k = ease(seg(la, .1, .5)); M.handR = [lerp(104, -230, k), lerp(-366, -600, k)]; M.poseR = 'pointe'; M.look = [k > .5 ? .9 : -.6, -.2]; }
  if (la > A[1] * .55) { M.look = [-.9, 0]; M.sourcil = .7; }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourcil = .4; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 430, 1.3], [B[0], 470, 420, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { paquetBacon(cc, 970, 470, .42, .05); tablePetitDej(cc, { assiette: 1, tasse: 1, cafetiere: 1, t }); } });
  c.restore();
}
