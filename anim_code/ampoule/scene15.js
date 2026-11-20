// SCÈNE 15 — Plans 26-29 (salon). s15a : dans la pénombre, le mouton hésite entre deux boîtes d'ampoules : « Alors je dois toujours acheter la moins chère ? »
// s15b : le renard tapote la mention des heures sur la boîte : « Pas forcément. Regarde aussi combien de temps elle dure. » ; s15c : les trois questions s'écrivent au carnet ;
// s15d : « Voilà. Un objet solide, c'est aussi une économie. » — le mouton visse la nouvelle ampoule : la lumière revient, chaude, sur tout le salon ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.3, .5]; M.froncer = .5; M.handL = [-170, -540]; M.handR = [40, -540]; M.poseL = M.poseR = 'poing';
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [230, -560]; R.poseR = 'pointe'; R.sourire = .6; M.look = [-.6, .5]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.froncer = 0; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const visse = ld >= 0 ? ease(seg(ld, .2, 1)) : 0, lum = ld >= 0 ? ease(seg(ld, .9, 1.3)) : 0;
  if (ld >= 0) { M.handL = [-104, -366]; M.poseL = 'repos'; M.handR = [lerp(40, -20, visse), lerp(-540, -820, visse)]; M.poseR = 'poing'; M.look = [-.2, -.9]; if (lum > 0) { M.look = [-.6, 0]; M.sourire = 1.1; } R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 420, 1.2]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, grillees: 3, t }) }, (cc) => {
    const a = mainScene(M, -1), b = mainScene(M, 1);
    if (ld < 0) { boiteAmpoules(cc, a[0] - 20, a[1] + 20, .45, -.1); boiteAmpoules(cc, b[0] + 10, b[1] + 20, .45, .08); cc.font = 'bold 13px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#fff2b0'; cc.fillText('0,90 F', a[0] - 20, a[1] - 20); cc.fillText('2 F · 10 000 h', b[0] + 10, b[1] - 20); }
    else ampouleC(cc, b[0] - 4, b[1] - 30, .5, Math.PI, lum);
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['combien', clamp(u * 3)], ['d’heures ?', clamp(u * 3 - .5)], ['garantie ?', clamp(u * 3 - 1.2)], ['réparable ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  obscurite(c, .8 * (1 - lum));
  if (lum > 0) { const g = c.createRadialGradient(700, 200, 20, 700, 300, 700); g.addColorStop(0, `rgba(255,230,160,${.25 * lum})`); g.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  c.restore();
}
