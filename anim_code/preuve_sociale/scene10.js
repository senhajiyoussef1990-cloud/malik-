// SCÈNE 10 — Plan 17 (salon). Dans le poste, la cliente se retourne vers ses voisins, la mine dépitée. Le mouton : « Elle ne l'aime même pas ! »
const A = L.s10a, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : A[0] + A[1] + 1.2);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = renardBase(t), M = voix(moutonBase(t), ['s10a'], t), la = t - A[0];
  R.x = 640; R.look = [-.9, .1]; R.lid = .55; R.sourire = .6;
  M.x = 400; M.look = [-1, .3]; let deux = true; M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing';
  if (la >= 0) { const k = ease(seg(la, 0, .3)); deux = false; M.handL = [-96, -400]; M.handR = [lerp(46, 210, k), lerp(-480, -660, k)]; M.poseR = 'pointe'; M.froncer = 0; M.sourire = 1.2; M.oreille = .3 * k; M.bob += Math.abs(Math.sin(t * 12)) * 4 * k;
    if (la > A[1] * .5) { M.rire = 1; M.look = [.9, 0]; } }
  if (la > A[1] * .5) { R.sourcil = .9; R.look = [-.7, -.1]; }
  const ecran = (cc, tt) => { chapellerieNB(cc, tt, { spot: .6, panneau: 1, vedette: false }); const V = marchandBase(tt, 760); V.face = -1; V.sourire = 1.2; dessine(cc, V, drawVendeur);
    file(cc, tt, 9, { modif: (P, k) => { if (k === 0) { P.v = 1; P.chapeau = (c2, hy) => chapeauNB(c2, 0, hy - 64, .62, 0, .1); P.face = 1; P.sourire = -1; P.froncer = 1; P.look = [-.9, 0]; P.tilt = .1; P.handR = [100, -560]; P.poseR = 'ouverte'; }
      if (k === 1 || k === 2) { P.look = [-.9, 0]; P.sourire = 1.2; } } }); };
  c.save(); cam(c, t, [[0, 300, 450, 1.6], [DUREE, 320, 440, 1.5]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran }, (cc) => {
    if (deux) { const a = mainScene(M, 1), b = mainScene(M, -1); chapeauMode(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, .44, 0); } else { const [hx, hy] = mainScene(M, -1); chapeauMode(cc, hx, hy + 2, .42, .25); } });
  c.restore();
}
