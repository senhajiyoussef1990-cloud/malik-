// SCÈNE 15 — Plans 24-25. Dans l'atelier, la voix du renard : « Le message a perdu son charme de certitude. » — la lumière s'éteint.
// Puis, en sortant de l'écran : « De retour au salon, la radio joue toujours. »
const A = L.s15a, B = L.s15b, ZD = 1.1, DUREE = B[0] + B[1] + .5, Z0 = B[0] - .1;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lum = 1 - ease(seg(t, A[0] + A[1] * .5, A[0] + A[1] + .1));
  const atelier = (cc, tt) => { imprimerieNB(cc, tt, { vit: lum, pile: 14, lumiere: lum }); };
  if (t < Z0) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 600, 420, 1.2], [DUREE, 560, 420, 1.1]]); atelier(cc, t); }); debutFlash(c, t); return; }
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-.8, .2]; M.x = 760; M.face = 1; M.look = [.8, .2]; M.oreille = .2;
  c.save(); camEcran(c, 1 - z, [560, 405, 1.05]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => atelier(cc, tt) }, (cc) => radioJoue(cc, t, z));
  c.restore(); flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}
