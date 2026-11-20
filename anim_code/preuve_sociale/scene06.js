// SCÈNE 06 — Plan 11 (salon). Dans le poste, une nouvelle arrivante se met en rang sans même regarder l'objet.
// Le mouton désigne l'écran, perplexe (s06a).
const A = L.s06a, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : A[0] + A[1] + 0.5);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = renardBase(t), M = voix(moutonBase(t), ['s06a'], t), la = t - A[0];
  R.x = 640; R.look = [-.9, .2]; R.lid = .58;
  M.x = 400; M.look = [-1, .3]; M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing'; let deux = true;
  if (la >= 0) { const k = ease(seg(la, 0, .35)); deux = false; M.handL = [-96, -400]; M.handR = [lerp(46, 200, k), lerp(-480, -640, k)]; M.poseR = 'pointe'; M.froncer = .9; M.sourire = -.2; M.tilt = .1 * k; M.oreille = -.2;
    if (la > A[1] * .6) { M.look = [.9, -.1]; M.handR = [140, -600]; M.poseR = 'ouverte'; } }
  if (la > A[1] * .6) { R.look = [-1, 0]; R.sourcil = .8; R.tilt = wob(tq, 1.2, .05); }   // le renard acquiesce
  c.save(); cam(c, t, [[0, 330, 450, 1.5], [DUREE, 310, 450, 1.62]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: emission(4 + ease(seg(t, .2, A[0] + A[1])), { v0: 0, modif: (P, k) => { if (k === 4) { P.v = 1; P.look = [.8, -.1]; } } }) }, (cc) => {
    if (deux) { const a = mainScene(M, 1), b = mainScene(M, -1); chapeauMode(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, .44, 0); } else { const [hx, hy] = mainScene(M, -1); chapeauMode(cc, hx, hy + 2, .42, .25); } });
  c.restore();
}
