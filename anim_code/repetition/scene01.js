// SCÈNE 01 — Plans 01-02. Le mouton tourne le bouton de la radio : la réclame passe encore (s01a).
// Le renard montre les trois affiches identiques derrière la fenêtre et les compte du doigt (s01b).
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 770; M.face = 1; M.look = [.9, .3];
  const k = ease(seg(t, 0, .5)); M.handR = [lerp(104, 196, k), lerp(-366, -520, k)]; M.poseR = 'pointe'; if (t > .5 && t < 1) M.handR[0] += Math.sin(t * 20) * 5;   // il tourne le bouton
  const vol = clamp((t - .5) / .3);
  if (la >= 0) { M.handR = [130, -430]; M.poseR = 'repos'; M.look = [-.2, -.5]; M.froncer = 0; M.sourire = .9; M.tilt = .08 + wob(tq, 2, .04); M.oreille = .2; }
  if (lb >= 0) { M.look = [.6, -.2]; M.froncer = .6; M.sourire = .2; }
  R.x = 460; R.look = [.9, -.2];
  if (lb >= 0) { const n = Math.min(3, Math.floor(seg(lb, .2, B[1]) * 3.2)); R.handR = [200 + n * 34, -760 + (Math.floor(lb * 3) % 2) * 10]; R.poseR = 'pointe'; R.lean = .05; R.sourcil = .8; R.look = [1, -.4]; }
  c.save(); cam(c, t, [[0, 800, 380, 1.45], [A[0] + A[1] * .6, 790, 380, 1.4], [B[0], 700, 330, 1.25], [DUREE, 720, 330, 1.3]]);
  dessineSalon(c, t, R, M, {}, (cc) => radioJoue(cc, t, vol));
  c.restore();
}
