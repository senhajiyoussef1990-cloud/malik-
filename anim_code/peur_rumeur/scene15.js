// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton relit le journal, le doigt sur les lignes. s15b : le renard pose la liste « source, date, contexte ».
// s15c : il écarte la manchette alarmante au profit d'un titre calme. s15d : télé éteinte, le renard referme calmement le journal.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 650; M.handL = [-200, -560]; M.handR = [-40 + Math.sin(t * 2.5) * 30, -600 + (t * .8 % 1) * 60]; M.poseL = 'poing'; M.poseR = 'pointe'; M.look = [-.6, .5]; M.froncer = .5;
  R.x = 400; R.look = [.9, .2]; let liste = 0, ecarte = 0, ferme = 0;
  if (lb >= 0) { liste = ease(seg(lb, 0, .5)); R.handR = [lerp(104, 220, liste), lerp(-440, -560, liste)]; R.poseR = 'ouverte'; R.lean = .05 * liste; M.look = [-.9, .2]; }
  if (lc >= 0) { ecarte = ease(seg(lc, .2, .8)); R.handR = [104, -440]; R.lean = 0; M.handR = [lerp(-40, 160, ecarte), -600]; M.poseR = 'ouverte'; M.look = [-.4, .4]; M.froncer = .1; M.sourire = .6; }
  if (ld >= 0) { ferme = ease(seg(ld, D[1] * .4, D[1])); R.handR = [220, -560]; R.poseR = 'ouverte'; R.look = [.6, .3]; R.lid = .55; M.handR = [104, -366]; M.poseR = 'repos'; M.look = [-.7, 0]; M.sourire = .5; }
  c.save(); cam(c, t, [[0, 560, 400, 1.45], [B[0], 540, 400, 1.4], [C[0], 620, 400, 1.5], [D[0], 540, 405, 1.15], [DUREE, 540, 405, 1.08]]);
  dessineSalon(c, t, R, M, {}, (cc) => {
    const a = mainScene(M, -1);
    if (ferme < 1) journal(cc, a[0] + 90 - ferme * 30, a[1] - 50, .62 * (1 - ferme * .5), { rot: -.05 });
    else { cc.save(); cc.translate(a[0] + 60, a[1] - 40); F(cc, poly([[-60, -80], [60, -80], [60, 80], [-60, 80]]), '#f4efe0', 3); cc.font = 'bold 14px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#2a2a2a'; cc.fillText('LE PETIT ÉCHO', 0, -60); cc.restore(); }
    if (liste > 0) { const [hx, hy] = mainScene(R, 1); cc.save(); cc.translate(hx + 10, hy - 30); cc.scale(liste, liste); F(cc, poly([[-56, -70], [56, -70], [56, 70], [-56, 70]]), '#fbf4e2', 3); cc.font = 'bold 17px Georgia'; cc.fillStyle = '#1a3a7a'; cc.textAlign = 'left'; ['✓ source', '✓ date', '✓ contexte'].forEach((l, k) => cc.fillText(l, -46, -30 + k * 36)); cc.restore(); }
    if (lc >= 0 && ferme < 1) { cc.save(); cc.translate(a[0] - 60 - ecarte * 60, a[1] - 160); cc.rotate(-.2 * ecarte); F(cc, poly([[-70, -20], [70, -20], [70, 20], [-70, 20]]), '#f4efe0', 2); cc.font = 'bold 16px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#a8181a'; cc.fillText('PANIQUE !', 0, 6); cc.restore();
      cc.save(); cc.translate(a[0] + 140, a[1] - 160); F(cc, poly([[-80, -20], [80, -20], [80, 20], [-80, 20]]), '#fbf8ee', 2); cc.font = '14px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#1a1a1a'; cc.fillText('Une charnière réparée', 0, 6); cc.restore(); }
  });
  c.restore();
}
