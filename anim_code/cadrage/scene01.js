// SCÈNE 01 — Plans 01-02. Le mouton rapproche les deux unes : « Ces deux journaux racontent des histoires différentes ! »
// Le renard, loupe à la main, aligne les coins des photos : « Et pourtant, ils photographient la même scène. »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  const rap = ease(seg(la, .1, .9));
  M.x = 660; M.handL = [lerp(-230, -140, rap), -560]; M.handR = [lerp(40, -20, rap), -560]; M.poseL = M.poseR = 'poing'; M.look = [-.5, .5]; M.froncer = .8; M.sourcil = .8;
  R.x = 400; R.look = [.9, .3];
  let lp = 0; if (lb >= 0) { lp = ease(seg(lb, 0, .4)); R.handR = [lerp(104, 170, lp), lerp(-440, -680, lp)]; R.poseR = 'poing'; R.lean = .06 * lp; R.lid = .45; R.look = [.7, .6]; M.look = [-.9, 0]; if (lb > B[1] * .6) { R.look = [1, 0]; R.sourcil = .8; R.lid = .55; } }
  c.save(); cam(c, t, [[0, 560, 400, 1.35], [DUREE, 560, 400, 1.45]]);
  dessineSalon(c, t, R, M, {}, (cc) => {
    const a = mainScene(M, -1), b = mainScene(M, 1);
    journalPhoto(cc, a[0] - 30, a[1] + 40, .46, 'fete', { rot: -.06 }); journalPhoto(cc, b[0] + 40, b[1] + 40, .46, 'flaque', { rot: .06 });
    if (lp > 0) { const [hx, hy] = mainScene(R, 1); loupe(cc, hx + 4, hy - 50, .8, -.3); }
  });
  c.restore();
}
