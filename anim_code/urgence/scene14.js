// SCÈNE 14 — Plan 25. « Retour au temps ordinaire. » Le stand rétrécit dans l'écran ; la pendule du salon reprend sa place.
const A = L.s14a, ZD = 1.2, DUREE = A[0] + A[1] + .7, Z0 = A[0] + A[1] * .2;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const stand = (cc, tt) => standNB(cc, tt, { panneau: 0, ferme: 1 });
  if (t < Z0) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); stand(cc, t); }); debutFlash(c, t); return; }
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-.6, -.3]; M.x = 640; M.look = [-.8, -.4];
  c.save(); camEcran(c, 1 - z, [470, 300, 1.25]); dessineSalon(c, t, R, M, { tv: 1, ecran: stand }); c.restore();
  flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}
