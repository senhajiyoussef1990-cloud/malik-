// SCÈNE 02 — Plans 03-04. Le mouton fixe la boîte, la main au-dessus du bouton sans appuyer : « Je veux juste essayer encore une fois. »
// Le renard montre la vieille télévision : « Observons pourquoi l'incertitude accroche l'attention. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 760; M.face = 1; M.look = [.9, .5]; M.handR = [220, -560 + Math.sin(t * 5) * 8]; M.poseR = 'pointe'; M.froncer = .7; M.lean = .06;
  R.x = 460; R.look = [.8, 0]; if (lb >= 0) { R.handL = [-260, -560]; R.poseL = 'pointe'; R.look = [-1, .3]; M.look = [-.8, 0]; M.face = -1; M.handR = [104, -366]; M.poseR = 'repos'; M.lean = 0; }
  c.save(); cam(c, t, [[0, 760, 420, 1.4], [B[0], 760, 420, 1.4], [B[0] + .4, 480, 420, 1.2], [DUREE, 460, 420, 1.2]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => boiteTickets(cc, 900, 508, .8, t) });
  c.restore();
}
