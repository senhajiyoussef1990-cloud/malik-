// SCÈNE 15 — Plans 26-29 (salon). s15a : « Je peux profiter sans rester accroché. » s15b : le renard pose une horloge et un carnet à côté de la boîte.
// s15c : le mouton saisit un livre à la place des enveloppes. s15d : plan large, tous deux lisent calmement.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 680; M.look = [.4, .3]; M.sourire = .7; R.x = 420; R.look = [.9, .1];
  let pose = 0; if (lb >= 0) { pose = ease(seg(lb, .2, .8)); R.handR = [lerp(104, 330, pose), lerp(-440, -520, pose)]; R.poseR = 'ouverte'; R.lean = .05 * pose; }
  let lv = 0; if (lc >= 0) { lv = ease(seg(lc, .2, .8)); R.handR = [104, -440]; R.lean = 0; M.handL = [-60, -520]; M.handR = [60, -520]; M.poseL = M.poseR = 'poing'; M.look = [0, .6]; M.sourire = 1; }
  if (ld >= 0) { R.handL = [-60, -520]; R.handR = [60, -520]; R.poseL = R.poseR = 'poing'; R.look = [0, .6]; R.lid = .6; }
  c.save(); cam(c, t, [[0, 600, 420, 1.3], [D[0], 540, 405, 1.12], [DUREE, 540, 405, 1.08]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { boiteTickets(cc, 900, 508, .8, t); if (pose > 0) { cc.save(); cc.globalAlpha = pose; montreGousset2(cc, 830, 470, t); F(cc, poly([[960, 500], [1010, 500], [1010, 470], [960, 470]]), '#fbf4e2', 2); cc.restore(); } } }, (cc) => {
    if (lv > 0) { const a = mainScene(M, -1), b = mainScene(M, 1); livre(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 20, .55 * lv + .01); }
    if (ld >= 0) { const a = mainScene(R, -1), b = mainScene(R, 1); livre(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 20, .55, .05); }
  });
  c.restore();
}
function montreGousset2(c, x, y, t) { F(c, ell(x, y, 26, 26), '#e3a42c', 3); F(c, ell(x, y, 20, 20), '#fbf4e2', 2); ink(c, 2.5, '#3a1a0a'); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(t * .5) * 15, y - Math.cos(t * .5) * 15); c.moveTo(x, y); c.lineTo(x, y - 10); c.stroke(); }
