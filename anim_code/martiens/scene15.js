// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton reprend le vieux journal « PANIQUE ! » et le regarde, déçu : « Alors même la légende de la panique était exagérée ? »
// s15b : le renard lève l'index : « Exactement. Même les histoires sur la manipulation peuvent manipuler. » ; s15c : les deux questions s'écrivent au carnet ;
// s15d : « Voilà. Le ton sérieux ne prouve rien. » — le mouton plie le journal et le range dans le livre, comme un marque-page ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.handL = [-170, -470]; M.handR = [30, -470]; M.poseL = M.poseR = 'poing'; M.look = [-.3, .5]; M.froncer = .5; M.sourcil = .3;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [120, -700]; R.poseR = 'pointe'; R.sourire = .6; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.froncer = 0; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const plie = ld >= 0 ? ease(seg(ld, .2, 1)) : 0;
  if (ld >= 0) { M.sourire = 1; M.look = [-.5, .5]; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, livre: 1, t }) }, (cc) => {
    const a = mainScene(M, -1), b = mainScene(M, 1), x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2;
    if (plie < 1) { cc.save(); cc.translate(x, y + 10); cc.scale(1, 1 - plie * .7); journal1938(cc, 0, 0, .7 * (1 - plie * .4), -.04); cc.restore(); } else livreMartiens(cc, x, y + 20, .5, -.05);
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui', clamp(u * 3)], ['raconte ?', clamp(u * 3 - .5)], ['qu’y', clamp(u * 3 - 1.4)], ['gagne-t-il ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
