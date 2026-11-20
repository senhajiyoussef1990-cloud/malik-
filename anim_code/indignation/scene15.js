// SCÈNE 15 — Plans 26-29 (salon). s15a : « Je peux ressentir la colère et vérifier d'abord. » s15b : le renard apporte une petite liste : contexte, date, source, suite.
// s15c : le mouton écrit une question respectueuse au lieu de relayer le titre. s15d : tous deux regardent la place par la fenêtre.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 640; M.handR = [80, -620]; M.poseR = 'poing'; M.froncer = .4; M.look = [-.6, .1]; M.sourire = .2;
  R.x = 400; R.look = [.9, .1]; let li = 0; if (lb >= 0 && lc < 0) { li = ease(seg(lb, 0, .4)); R.handR = [lerp(104, 220, li), lerp(-440, -600, li)]; R.poseR = 'poing'; }
  let ec = 0; if (lc >= 0) { ec = seg(lc, .2, C[1]); M.handL = [-60, -520]; M.handR = [40 + Math.sin(t * 14) * 6 * (ec < 1), -540]; M.poseL = 'ouverte'; M.poseR = 'poing'; M.look = [0, .7]; M.froncer = .1; M.sourire = .6; }
  const fen = ease(seg(ld, 0, 1));
  if (ld >= 0) { R.x = lerp(400, 700, fen); M.x = lerp(640, 900, fen); R.face = 1; M.face = 1; R.look = [.9, -.2]; M.look = [.9, -.2]; R.handR = [104, -440]; R.poseR = 'repos'; M.handL = [-104, -366]; M.handR = [104, -366]; M.poseL = M.poseR = 'repos'; if (fen > 0 && fen < 1) { R.walk = t * 8; M.walk = t * 8; } }
  c.save(); cam(c, t, [[0, 520, 400, 1.3], [D[0], 520, 400, 1.3], [DUREE, 800, 330, 1.35]]);
  dessineSalon(c, t, R, M, { file: 0 }, (cc) => {
    if (li > 0 && lc < 0) { const [hx, hy] = mainScene(R, 1); cc.save(); cc.translate(hx + 10, hy - 30); cc.scale(li, li); F(cc, poly([[-60, -80], [60, -80], [60, 80], [-60, 80]]), '#fbf4e2', 3); cc.font = 'bold 16px Georgia'; cc.fillStyle = '#1a3a7a'; cc.textAlign = 'left'; ['✓ contexte', '✓ date', '✓ source', '✓ suite'].forEach((l, k) => cc.fillText(l, -50, -44 + k * 32)); cc.restore(); }
    if (lc >= 0 && ld < 0) { const a = mainScene(M, -1), b = mainScene(M, 1); carnet(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 30, .6, [['Que s’est-il', ec * 2], ['passé ensuite ?', ec * 2 - 1]], 1, .04); }
  });
  c.restore();
}
