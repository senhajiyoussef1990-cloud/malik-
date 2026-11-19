// SCÈNE 15 — le mouton repart heureux avec sa boîte ; le renard fait un clin d'œil au spectateur. Renard s15a, mouton s15b.
const DUREE = FIN(2.2);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15a'], t), M = voix(moutonBase(t), ['s15b'], t), la = local('s15a', t), lb = local('s15b', t);
  R.look = [0, 0]; R.lid = .55;                                                         // il parle au spectateur
  if (la >= 0) { R.handR = [140, -660]; R.poseR = 'ouverte'; R.sourcil = .7; R.tilt = wob(step(t), .5, .05); if (la > L.s15a[1] * .6) { R.handR = [90, -780]; R.poseR = 'pointe'; } }
  const part = L.s15b[0] - .4, u = ease(seg(t, part, DUREE - .8));
  M.handR = [70, -470]; M.handL = [-70, -470]; M.poseR = M.poseL = 'ouverte'; M.sourire = 1; M.froncer = 0; M.look = [-.3, 0];   // il serre sa boîte contre lui
  if (t > part) { M.face = 1; M.x = lerp(830, 1250, u); M.walk = (t - part) * 9; M.bob = Math.abs(Math.sin((t - part) * 9)) * 10; M.look = [.6, 0]; }
  if (lb >= 0) { M.sourire = 1.2; M.tilt = wob(step(t), 1.2, .05); }
  const clin = t > DUREE - 1.6 && t < DUREE - .9;
  if (clin) { R.wink = true; R.talk = 0; R.sourcil = 1; }
  c.save(); cam(c, t, [[0, 500, 405, 1.06], [L.s15a[0] + .3, 330, 360, 1.3], [part, 600, 405, 1.06], [DUREE - 1.7, 330, 330, 1.5], [DUREE, 330, 330, 1.5]]);
  dessineBoutique(c, t, R, M, (cc) => { boite(cc, 350, 560, .82, t, 0); boite(cc, 590, 560, .82, t, 2); });
  const mx = M.x + 0 * M.s, my = M.y - 470 * M.s - M.bob; boite(c, mx, my + 34, .5, t, 1);                   // la boîte dans ses bras
  c.restore();
  if (t > DUREE - .6) { c.fillStyle = `rgba(0,0,0,${ease(seg(t, DUREE - .6, DUREE))})`; c.fillRect(0, 0, W, H); }
}
