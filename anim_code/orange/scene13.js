// SCÈNE 13 — Plan 24 (TV + héros). Dans le verger, le renard cueille une orange (en couleur), la fait sauter dans sa main : « Une orange, ça se croque aussi. Personne ne l'interdit. » Le mouton sourit.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 680); voix(R, ['s13a'], t);
  R.look = [.8, -.2]; M.look = [-.8, -.2]; M.sourire = .6;
  const saut = la >= 0 ? Math.abs(Math.sin(la * 3.2)) : 0;
  R.handR = [120, -620]; R.poseR = 'ouverte'; if (la > A[1] * .6) { M.sourire = 1; M.rire = 1; R.sourire = 1; }
  nbEtCouleur(c, t, [[0, 520, 400, 1.2], [DUREE, 540, 410, 1.24]], (cc) => vergerNB(cc, t, { cagettes: 3 }), (cc) => { heros(cc, R, M); const h = mainScene(R, 1); orangeFruit(cc, h[0] + 6, h[1] - 30 - saut * 70, 22, la * 4); });
  debutFlash(c, t);
}
