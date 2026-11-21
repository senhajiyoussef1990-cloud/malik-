// SCÈNE 11 — Plans 20-21 (TV + héros). Devant le rayon d’eaux, le mouton (en couleur) soupèse une bouteille : « Donc on m’a vendu de la peur… en bouteille ? »
// Le renard compte sur ses doigts : « Un peu de peur, beaucoup d’image, et une source bien jolie. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 640, 400); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'poing'; M.froncer = .6; M.sourcil = .9; }
  if (lb >= 0) { R.handR = [150, -600]; R.poseR = Math.floor(lb * 1.2) % 2 ? 'pointe' : 'ouverte'; R.sourcil = .5; R.sourire = .5; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 600, 400, 1.12], [DUREE, 620, 400, 1.15]], (cc) => rayonEau(cc, t, 1), (cc) => { heros(cc, R, M); if (la >= 0 && lb < 0) { const a = mainScene(M, 1); bouteilleCouleur(cc, a[0], a[1] + 40, .45); } });
  debutFlash(c, t);
}
