// SCÈNE 02 — Plans 03-04. Le mouton fredonne la formule devant son reflet dans la vitre (s02a) ;
// le renard trace un cercle et un point d'interrogation à la craie sur l'ardoise (s02b).
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .7;
const [AX, AY] = ARDOISE;
function dessinArdoise(c, u) {                                         // cercle puis « ? »
  const cer = []; for (let k = 0; k <= 40; k++) { const a = -Math.PI / 2 + k / 40 * Math.PI * 2; cer.push([AX + 80 + Math.cos(a) * 58, AY + 100 + Math.sin(a) * 66]); }
  craie(c, cer, clamp(u * 1.6));
  const q = []; for (let k = 0; k <= 20; k++) { const a = Math.PI + k / 20 * Math.PI * 1.4; q.push([AX + 80 + Math.cos(a) * 20, AY + 80 + Math.sin(a) * 20]); } q.push([AX + 80, AY + 116]);
  craie(c, q, clamp(u * 1.6 - .6), 6); if (u > .95) F(c, ell(AX + 80, AY + 136, 4, 4), '#f4f0e4', 0);
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 760; M.face = 1; M.look = [1, -.3]; M.sourire = .8; M.froncer = .1; M.tilt = wob(tq, 1.5, .05);
  if (la >= 0 && lb < 0) { M.handL = [-60, -560]; M.poseL = 'repos'; M.lid = .7; }
  R.x = 300; R.look = [.8, 0];
  let u = 0;
  if (lb >= 0) { u = seg(lb, .1, B[1] + .3); const a = -Math.PI / 2 + clamp(u * 1.6) * Math.PI * 2; R.handL = [-200 + Math.cos(a) * 60, -720 + Math.sin(a) * 60]; R.poseL = 'pointe'; R.look = [-1, -.3]; R.lean = -.05; R.sourcil = .6;
    if (u > .6) { R.handL = [-210, -740 + (u - .6) * 120]; } if (u >= 1) { R.handL = [-150, -560]; R.poseL = 'ouverte'; R.look = [1, 0]; } }
  c.save(); cam(c, t, [[0, 820, 330, 1.5], [A[0] + A[1], 800, 330, 1.45], [B[0], 280, 330, 1.45], [DUREE, 300, 350, 1.35]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => dessinArdoise(cc, u) }, (cc) => { radioJoue(cc, t, .6); if (la >= 0 && lb < 0) bulle(cc, 900, 200, '♪ La boisson des vainqueurs ! ♪', clamp(la * 3), 20); });
  c.restore();
}
