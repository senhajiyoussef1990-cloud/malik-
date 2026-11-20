// SCÈNE 14 — Plan 25. « La vraie confiance supporte des questions. » L'auditorium rétrécit dans l'écran du téléviseur du salon.
const A = L.s14a, ZD = 1.2, DUREE = A[0] + A[1] + .6, Z0 = A[0] + A[1] * .3;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const aud = (cc, tt) => auditoriumNB(cc, tt, { rideau: 1, diplome: 1, pupitre: 1, dossiers: 8 });
  if (t < Z0) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); aud(cc, t); }); debutFlash(c, t); return; }
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-.8, .2]; M.x = 640; M.look = [-1, .2];
  c.save(); camEcran(c, 1 - z, [540, 405, 1.05]); dessineSalon(c, t, R, M, { tv: 1, ecran: aud, derriere: (cc) => afficheExpert(cc, 150, 200, .7) }); c.restore();
  flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}
