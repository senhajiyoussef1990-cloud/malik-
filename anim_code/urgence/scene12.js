// SCÈNE 12 — Plans 22-23 (TV + héros). Le mouton revient devant la casserole : « Et d'abord… en ai-je besoin ? »
// Le renard montre un banc, loin de la musique du stand : « Une décision importante mérite une respiration. »
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 300, 640); voix(R, ['s12b'], t); voix(M, ['s12a'], t);
  M.face = -1; M.look = [.4, .4]; M.handR = [40, -660]; M.poseR = 'poing'; M.froncer = .7; M.tilt = .06;
  if (lb >= 0) { R.handL = [-240, -560]; R.poseL = 'ouverte'; R.look = [-.8, 0]; R.sourire = .8; M.look = [.9, 0]; M.handR = [104, -366]; M.poseR = 'repos'; M.froncer = .2; }
  nbEtCouleur(c, t, [[0, 520, 420, 1.1]], (cc) => { standNB(cc, t, { panneau: 1, sablier: .5 }); banc(cc, 120, 780); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
