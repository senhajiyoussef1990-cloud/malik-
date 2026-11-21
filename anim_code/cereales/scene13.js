// SCÈNE 13 — Plan 24 (TV + héros). Devant le mur de boîtes, le renard prend une boîte et pointe le bandeau du doigt : « Avant de croire une vérité, demande qui l'a écrite. » Le mouton plisse les yeux, convaincu.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.6, .4]; M.look = [-.8, .2];
  R.handR = [140, -600]; R.poseR = 'poing'; if (la > A[1] * .3) { R.handL = [60, -640]; R.poseL = 'pointe'; }
  if (la > A[1] * .6) { R.look = [.9, 0]; R.sourire = .7; M.lid = .45; M.sourire = .6; M.tilt += Math.sin(t * 6) * .04; }
  nbEtCouleur(c, t, [[0, 540, 410, 1.18], [DUREE, 540, 420, 1.22]], (cc) => rayonNB(cc, t, {}), (cc) => { heros(cc, R, M); const h = mainScene(R, 1); boiteCereales(cc, h[0] + 20, h[1] - 30, .42, .05, t); });
  debutFlash(c, t);
}
