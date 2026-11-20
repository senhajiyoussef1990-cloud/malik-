// SCÈNE 11 — Plan 20 (salon). « Il faut remonter à l'origine. » Le renard écrit « VÉRIFIÉ ? » à la craie, le souligne et trace une flèche.
const A = L.s11a, DUREE = A[0] + A[1] + .7;
const [AX, AY] = ARDOISE;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s11a'], t), M = moutonBase(t), la = t - A[0], u = seg(la, 0, A[1] + .2);
  R.x = 300; R.look = [-1, -.3]; const k = clamp(u * 1.4);
  R.handL = [-260 + k * 120, -700 + (k > .6 ? 70 : 0)]; R.poseL = 'pointe'; R.lean = -.04;
  if (u >= 1) { R.handL = [-104, -440]; R.poseL = 'repos'; R.look = [1, 0]; R.sourcil = .7; }
  M.x = 560; M.look = [-1, -.2]; M.froncer = .3; M.oreille = .15;
  c.save(); cam(c, t, [[0, 300, 340, 1.5], [DUREE, 320, 360, 1.42]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => {
    const cer = []; for (let q = 0; q <= 40; q++) { const a = -Math.PI / 2 + q / 40 * Math.PI * 2; cer.push([AX + 80 + Math.cos(a) * 30, AY + 50 + Math.sin(a) * 34]); } craie(cc, cer, 1, 3);
    texteCraie(cc, '?', AX + 80, AY + 62, 1, 30);
    texteCraie(cc, 'VÉRIFIÉ', AX + 80, AY + 150, k, 26);
    craie(cc, [[AX + 26, AY + 160], [AX + 134, AY + 160]], seg(u, .7, .85));
    craie(cc, [[AX + 80, AY + 100], [AX + 80, AY + 124], [AX + 70, AY + 114], [AX + 80, AY + 124], [AX + 90, AY + 114]], seg(u, .85, 1));
  } });
  c.restore();
}
