// SCÈNE 02 — Plans 03-04. Le renard, main sur la hanche, lève un sourcil (s02a) ; le mouton tient le chapeau à deux mains,
// puis court à la fenêtre : dehors, une file s'allonge devant une vitrine (s02b).
const T1 = L.s02a[0], D1 = L.s02a[1], T2 = L.s02b[0], D2 = L.s02b[1];
const DUREE = T2 + D2 + 1.2;
const X_FEN = 745;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02a'], t), M = voix(moutonBase(t), ['s02b'], t);
  const la = t - T1, lb = t - T2;
  // ---- le renard : main sur la hanche, sourcil levé
  R.x = 430; R.handR = [96, -480]; R.poseR = 'poing'; R.look = [.8, -.1]; R.lid = .6;
  if (la >= 0 && t < T2) { const k = ease(seg(la, .2, .6)); R.sourcil = k; R.tilt = -.07 * k + wob(tq, .5, .02); R.handL = [lerp(-104, -150, k), lerp(-440, -640, k)]; R.poseL = 'ouverte'; }
  if (lb >= 0) { R.look = [1, -.2]; R.sourcil = .6; R.handL = [-104, -440]; }
  // ---- le mouton : chapeau à deux mains, puis à la fenêtre
  const u = ease(seg(t, T1 + D1 + .15, T2 + .1));
  M.x = lerp(660, X_FEN, u); M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing'; M.look = [-.7, -.1]; M.froncer = .5; M.sourire = 0;
  if (la >= 0 && t < T2) { M.look = [-.9, -.2]; M.froncer = .7; M.tilt = .05; }
  if (u > 0 && u < 1) { M.walk = t * 11; M.bob = Math.abs(Math.sin(t * 11)) * 9; M.face = 1; M.look = [.8, 0]; }
  let deux = true;
  if (u >= 1) {
    M.face = 1; deux = false; M.handL = [-96, -400]; M.poseL = 'poing';
    const k = ease(seg(lb, 0, .4)); M.lean = .1 * k; M.look = [1, -.3]; M.oreille = .25 * k; M.froncer = 0; M.sourire = .9;
    M.handR = [lerp(46, 190, k), lerp(-480, -720, k) + wob(tq, 3, 6 * k)]; M.poseR = 'pointe';
    if (lb > D2 * .5) { M.lean = .04; M.look = [-.2, 0]; M.sourire = .5; M.handR = [150, -560]; M.poseR = 'ouverte'; M.tilt = -.06; }   // « Ils savent sûrement quelque chose »
  }
  const nFile = 3 + 5 * ease(seg(t, T2 - .6, T2 + D2));                       // la file s'allonge dehors
  c.save();
  cam(c, t, [[0, 520, 380, 1.12], [T1 + .1, 470, 320, 1.36], [T2 - .4, 760, 330, 1.2], [T2 + .4, 840, 300, 1.4], [DUREE, 820, 320, 1.32]]);
  dessineSalon(c, t, R, M, { file: nFile }, (cc) => {
    if (deux) { const a = mainScene(M, 1), b = mainScene(M, -1); chapeauMode(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, .44, 0); }
    else { const [hx, hy] = mainScene(M, -1); chapeauMode(cc, hx, hy + 2, .42, .25); }
  });
  c.restore();
}
