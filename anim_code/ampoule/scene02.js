// SCÈNE 02 — Plans 03-04 (salon). Dans la pénombre, le mouton écarquille les yeux : « Cent ans ? Alors pourquoi les miennes meurent si vite ? » — sur la table, trois ampoules grillées alignées.
// Le renard craque une allumette et la tend vers le poste : « Parce que quelqu'un l'a décidé. Allons voir. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.7, 0]; M.sourcil = 1; M.handL = [-160, -580]; M.handR = [10, -580]; M.poseL = M.poseR = 'ouverte';
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'poing'; R.sourire = .6; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, boite: 1, grillees: 3, t }) });
  obscurite(c, .8);
  if (lb >= 0) { const h = mainScene(R, -1); const g = c.createRadialGradient(h[0] - 20, h[1] - 40, 4, h[0] - 20, h[1] - 40, 220); g.addColorStop(0, 'rgba(255,200,110,.45)'); g.addColorStop(1, 'rgba(255,200,110,0)'); c.fillStyle = g; c.fillRect(h[0] - 260, h[1] - 280, 520, 520); F(c, poly([[h[0] - 22, h[1] - 10], [h[0] - 18, h[1] - 10], [h[0] - 18, h[1] - 40], [h[0] - 22, h[1] - 40]]), '#f2e0b0', 1); F(c, smooth([[h[0] - 28, h[1] - 40], [h[0] - 20, h[1] - 64 - Math.sin(t * 12) * 3], [h[0] - 12, h[1] - 40]]), '#ffb030', 1.5); }
  c.restore();
}
