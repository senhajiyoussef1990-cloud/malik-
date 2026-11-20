// SCÈNE 02 — Plans 03-04. Le mouton se bouche une oreille en penchant la tête : « Pourtant, ça résonne très fort ! »
// Le renard montre le téléviseur et le dessin d'une vallée entourée de montagnes : « Voyons un village entouré d'échos. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 660; M.handR = [40, -740]; M.poseR = 'ouverte'; M.tilt = .14; M.froncer = 1; M.oreille = -.3; M.look = [-.6, 0];
  R.x = 420; R.look = [.8, .1]; let dv = 0; if (lb >= 0) { dv = ease(seg(lb, 0, .4)); R.handR = [lerp(104, 160, dv), lerp(-440, -560, dv)]; R.poseR = 'poing'; R.handL = [-260, -560]; R.poseL = 'pointe'; R.look = [-1, .2]; M.tilt = 0; M.handR = [104, -366]; M.poseR = 'repos'; M.look = [-1, .1]; }
  c.save(); cam(c, t, [[0, 600, 420, 1.3], [B[0], 600, 420, 1.3], [B[0] + .4, 420, 420, 1.2], [DUREE, 420, 420, 1.2]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => hautParleurs(cc, 905, 450, t, 1) }, (cc) => { if (dv > 0) { const [hx, hy] = mainScene(R, 1); dessinVallee(cc, hx + 40, hy - 40, .7 * dv); } });
  c.restore();
}
