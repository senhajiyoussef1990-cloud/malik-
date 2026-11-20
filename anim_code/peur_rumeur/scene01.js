// SCÈNE 01 — Plans 01-02. Le mouton tend le journal en tremblant : « Renard, tu as lu cette alerte ? »
// Le renard lit le titre à la loupe, puis la baisse et regarde le mouton : « J'ai lu le titre. Pas encore les faits. »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  const tr = Math.sin(t * 40) * 4;                                     // il tremble
  M.x = 620; M.froncer = 1; M.sourire = -.5; M.oreille = -.25; M.look = [-.9, 0];
  const k = ease(seg(t, 0, .5)); M.handL = [lerp(-104, -200, k), lerp(-366, -560, k) + tr]; M.handR = [lerp(104, -60, k), lerp(-366, -560, k) + tr]; M.poseL = M.poseR = 'poing'; M.lean = .06 * k;
  R.x = 400; R.look = [.9, .1]; let lp = 0;
  if (la > A[1] * .5) { lp = ease(seg(la, A[1] * .5, A[1] * .5 + .4)); R.handR = [lerp(104, 160, lp), lerp(-440, -720, lp)]; R.poseR = 'poing'; R.lean = .07 * lp; R.lid = .45; R.look = [.6, .6]; }
  if (lb > B[1] * .45) { const d = ease(seg(lb, B[1] * .45, B[1] * .45 + .35)); R.handR = [lerp(160, 104, d), lerp(-720, -500, d)]; R.lean = .07 * (1 - d); R.look = [1, -.1]; R.lid = .55; R.sourcil = .9; lp = 1 - d; }
  c.save(); cam(c, t, [[0, 520, 400, 1.3], [A[0] + .4, 540, 380, 1.45], [B[0], 470, 330, 1.6], [DUREE, 500, 350, 1.5]]);
  dessineSalon(c, t, R, M, {}, (cc) => {
    const a = mainScene(M, 1), b = mainScene(M, -1); journal(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 60, .62 * k + .01, { rot: -.05 + tr * .004 });
    if (lp > 0) { const [hx, hy] = mainScene(R, 1); loupe(cc, hx + 6, hy - 50, .85, -.3); }
  });
  c.restore();
}
