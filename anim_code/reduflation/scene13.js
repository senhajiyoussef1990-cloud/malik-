// SCÈNE 13 — Plan 24 (TV + héros). Dans l'épicerie, le renard pose le grand ancien paquet à côté du petit nouveau et sourit : « Ce n'est pas toi qui as grandi, c'est le paquet qui a rétréci. » Le mouton rit.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.6, .5]; M.look = [-.6, .5];
  if (la >= 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .7; }
  if (la > A[1] * .6) { R.look = [.9, 0]; M.look = [-.8, 0]; M.rire = 1; M.sourire = 1; }
  const r = .9 - .35 * ease(seg(la, .3, A[1] * .8));
  nbEtCouleur(c, t, [[0, 540, 420, 1.15], [DUREE, 540, 430, 1.2]], (cc) => epicerieNB(cc, t, { n: 10 }), (cc) => { heros(cc, R, M); paquetBiscuits(cc, 540, 640, .55, { n: 15 }); paquetBiscuits(cc, 640, 640 + (.55 - r * .55) * 120, r * .55, { n: 10 }); });
  debutFlash(c, t);
}
