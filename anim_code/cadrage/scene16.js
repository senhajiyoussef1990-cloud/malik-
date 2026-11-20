// SCÈNE 16 — Plans 26-29 (salon). s16a : le renard tient un journal dont la main cache le bas de page, puis la retire : « Qu'est-ce qu'on ne te montre pas ici ? »
// s16b : le mouton ouvre le journal en entier et consulte une seconde source. s16c : le renard place les deux journaux côte à côte, paumes ouvertes.
// s16d : le mouton accroche une vue panoramique plus équilibrée de la fontaine.
const A = L.s16a, B = L.s16b, C = L.s16c, D = L.s16d, DUREE = D[0] + D[1] + .8;
const PANO = [610, 120];
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s16a', 's16c'], t), M = voix(moutonBase(t), ['s16b', 's16d'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  R.x = 400; R.look = [.9, .1]; M.x = 680; M.look = [-.8, .2];
  R.handR = [170, -600]; R.handL = [40, -600]; R.poseR = R.poseL = 'poing';
  const main = 1 - ease(seg(la, A[1] * .5, A[1] * .5 + .4));
  let tient = 'renard';
  if (lb >= 0) { tient = 'mouton'; R.handR = [104, -440]; R.handL = [-104, -440]; R.poseR = R.poseL = 'repos'; M.handL = [-220, -560]; M.handR = [-30, -560]; M.poseL = M.poseR = 'poing'; M.look = [-.5, .5]; M.froncer = .4; }
  if (lc >= 0) { tient = 'cote'; R.handL = [-160, -600]; R.handR = [160, -600]; R.poseL = R.poseR = 'ouverte'; R.sourire = .8; M.handL = [-104, -366]; M.handR = [104, -366]; M.poseL = M.poseR = 'repos'; M.look = [-.8, .3]; }
  const pano = ease(seg(ld, .1, .8));
  if (ld >= 0) { M.handR = [lerp(104, -100, pano), lerp(-366, -900, pano)]; M.poseR = 'ouverte'; M.look = [-.4, -.7]; M.sourire = 1.1; M.froncer = 0; R.look = [.6, -.5]; R.handL = [-104, -440]; R.handR = [104, -440]; R.poseL = R.poseR = 'repos'; R.sourire = 1; }
  c.save(); cam(c, t, [[0, 520, 400, 1.35], [DUREE, 560, 360, 1.25]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { if (ld >= 0) { cc.save(); cc.globalAlpha = pano; cadreMur(cc, PANO[0], PANO[1] + (1 - pano) * 60, 300, 120, (c2) => { c2.drawImage(vuePlace(), 0, 200, 1080, 430, PANO[0] - 150, PANO[1] - 60 + (1 - pano) * 60, 300, 120); }); cc.restore(); } } }, (cc) => {
    if (tient === 'renard') { const a = mainScene(R, 1); journalPhoto(cc, a[0] - 50, a[1] - 50, .5, 'fete', { rot: .03, cache: main }); }
    else if (tient === 'mouton') { const a = mainScene(M, -1); journalPhoto(cc, a[0] + 40, a[1] - 50, .5, 'fete', { rot: -.04 }); if (lb > B[1] * .5) journalPhoto(cc, a[0] + 200, a[1] - 40, .45, 'flaque', { rot: .06 }); }
    else if (tient === 'cote') { journalPhoto(cc, 470, 560, .42, 'fete', { rot: -.05 }); journalPhoto(cc, 610, 560, .42, 'flaque', { rot: .05 }); }
  });
  c.restore();
}
