// SCÈNE 14 — « Retour au salon. »
const A = L.s14a, ZD = 1.2, DUREE = A[0] + A[1] + .7, Z0 = A[0] + A[1] * .2;
const X = ((cc, t, u) => placePotion(cc, t, {}));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const ecran = (cc, tt) => X(cc, tt, 1);
  if (t < Z0) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); ecran(cc, t); }); debutFlash(c, t); return; }
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 345; R.look = [-.6, -.3]; M.x = 718; M.look = [-.8, -.4];
  c.save(); camEcran(c, 1 - z, [470, 330, 1.25]); dessineSalon(c, t, R, M, { tv: 1, ecran, derriere: (cc) => tablePetitDej(cc, { tasse: 1, objet: 1, t }) }); c.restore();
  flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}
