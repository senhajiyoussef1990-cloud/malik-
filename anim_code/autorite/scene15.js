// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton regarde l'affiche du début avec recul. s15b : le renard dessine à la craie une balance entre « diplôme » et « données ».
// s15c : il met le produit de côté, faute d'informations. s15d : tous deux devant le tableau des questions.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .8;
const [AX, AY] = ARDOISE;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0], u = seg(lb, 0, B[1] + .2);
  M.x = 640; M.look = [-1, -.3]; M.handR = [104, -440]; M.poseR = 'repos'; M.froncer = .4;
  R.x = 360; R.look = [.8, 0];
  if (lb >= 0 && lc < 0) { R.handL = [-200 + Math.cos(u * 9) * 40, -720 + Math.sin(u * 9) * 40]; R.poseL = 'pointe'; R.look = [-1, -.3]; R.lean = -.04; }
  const cote = ease(seg(lc, .2, .9));
  if (lc >= 0) { M.handR = [lerp(104, 220, cote), lerp(-440, -500, cote)]; M.poseR = 'poing'; M.look = [.6, .3]; M.sourire = .5; }
  if (ld >= 0) { R.look = [0, 0]; R.handR = [150, -600]; R.poseR = 'ouverte'; M.look = [-.6, 0]; M.sourire = 1; }
  c.save(); cam(c, t, [[0, 460, 380, 1.25], [DUREE, 480, 390, 1.2]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => {
    ink(cc, 3, 'rgba(244,240,228,.92)'); const v = clamp(u * 2); craie(cc, [[AX + 80, AY + 40], [AX + 80, AY + 150]], v, 3); craie(cc, [[AX + 20, AY + 70], [AX + 140, AY + 70]], clamp(u * 2 - .3), 3);
    texteCraie(cc, 'diplôme', AX + 34, AY + 110, clamp(u * 2 - .6), 14); texteCraie(cc, 'données', AX + 126, AY + 100, clamp(u * 2 - 1), 14); craie(cc, [[AX + 60, AY + 160], [AX + 100, AY + 160]], v, 4);
    afficheExpert(cc, 980, 210, .45);
  } }, (cc) => { const [hx, hy] = mainScene(M, 1); cc.save(); cc.translate(hx + 10, hy + 20); cc.scale(.9, .9); F(cc, poly([[-16, 0], [-18, -70], [-8, -90], [8, -90], [18, -70], [16, 0]]), '#c8341c', 2); F(cc, poly([[-14, -60], [14, -60], [14, -30], [-14, -30]]), '#fff', 1.5); cc.restore(); });
  c.restore();
}
