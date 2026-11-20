// SCÈNE 14 — Plan 25. « Le mécanisme reste dans la machine. » La foire s'éloigne dans l'écran ; retour au salon.
const A = L.s14a, ZD = 1.2, DUREE = A[0] + A[1] + .6, Z0 = A[0] + A[1] * .3;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const foire = (cc, tt) => { feteNB(cc, tt, { manege: 260 }); machine(cc, 760, 760, .9, tt, { clignote: true }); };
  if (t < Z0) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); foire(cc, t); }); debutFlash(c, t); return; }
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-.8, .2]; M.x = 640; M.look = [-1, .2];
  c.save(); camEcran(c, 1 - z, [540, 405, 1.05]); dessineSalon(c, t, R, M, { tv: 1, ecran: foire, derriere: (cc) => boiteTickets(cc, 900, 508, .8, t) }); c.restore();
  flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}
