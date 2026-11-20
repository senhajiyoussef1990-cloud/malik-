// SCÈNE 09 — Plan 18 (salon). « C'est la même phrase, encore une fois. » Le mouton retourne l'affiche : derrière, aucun document.
const A = L.s09a, DUREE = A[0] + A[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = renardBase(t), M = voix(moutonBase(t), ['s09a'], t), la = t - A[0];
  M.x = 640; M.handL = [-60, -520]; M.handR = [60, -520]; M.poseL = M.poseR = 'poing'; M.look = [0, .6]; M.froncer = .8;
  const r = ease(seg(la, A[1] * .45, A[1] * .45 + .5));
  if (r > .5) { M.look = [-.5, .2]; M.sourcil = 1; M.sourire = -.2; M.tilt = .08; M.oreille = -.15; }
  R.x = 400; R.look = [.9, .3]; R.lid = .55; if (r > .9) { R.sourcil = .8; R.sourire = .6; }
  c.save(); cam(c, t, [[0, 600, 420, 1.45], [DUREE, 630, 420, 1.55]]);
  dessineSalon(c, t, R, M, {}, (cc) => {
    const a = mainScene(M, 1), b = mainScene(M, -1), x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2 + 10;
    cc.save(); cc.translate(x, y); cc.scale(Math.cos(r * Math.PI), 1);
    if (r < .5) afficheVainqueurs(cc, 0, -60, .6, true); else { F(cc, poly([[-45, -60], [45, -60], [45, 60], [-45, 60]]), '#f2ead6', 3); c.fillStyle = 'rgba(0,0,0,.06)'; }   // le dos : vide
    cc.restore();
  });
  c.restore();
}
