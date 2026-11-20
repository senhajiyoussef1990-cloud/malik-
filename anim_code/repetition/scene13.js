// SCÈNE 13 — Plan 22 (salon). « Je peux comparer au lieu de répéter. » Le mouton met côte à côte l'affiche et une liste d'informations.
const A = L.s13a, DUREE = A[0] + A[1] + .8;
function liste(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); F(c, poly([[-60, -100], [60, -100], [60, 60], [-60, 60]]), '#fbf4e2', 3); c.font = 'bold 15px Georgia'; c.fillStyle = '#1a3a7a'; c.textAlign = 'left'; ['Composition', 'Sucre', 'Prix', 'Source'].forEach((l, k) => { c.fillText('• ' + l, -48, -68 + k * 32); ink(c, 1.4, 'rgba(26,58,122,.4)'); c.beginPath(); c.moveTo(-48, -60 + k * 32); c.lineTo(48, -60 + k * 32); c.stroke(); }); c.restore(); }
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = renardBase(t), M = voix(moutonBase(t), ['s13a'], t), la = t - A[0], k = ease(seg(la, .1, .9));
  M.x = 640; M.handL = [lerp(-60, -170, k), -560]; M.handR = [lerp(60, 170, k), -560]; M.poseL = M.poseR = 'poing'; M.froncer = .2; M.sourire = .6;
  M.look = [Math.sin(t * 3) * .8, .3];
  R.x = 400; R.look = [.9, .1]; R.sourire = .8; R.lid = .55;
  c.save(); cam(c, t, [[0, 600, 400, 1.35], [DUREE, 630, 390, 1.5]]);
  dessineSalon(c, t, R, M, {}, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); afficheVainqueurs(cc, a[0] - 20, a[1] - 60, .55, true); liste(cc, b[0] + 20, b[1] + 20, .75); });
  c.restore();
}
