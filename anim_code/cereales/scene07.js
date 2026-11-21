// SCÈNE 07 — Plans 12-13 (TV + héros). Dans la cuisine aux flocons, le mouton (en couleur) regarde la boîte « régime de santé » et le sac de sucre : « Donc au départ, c'était un régime de clinique ? »
// Le renard pose la vieille boîte à côté de la nouvelle : « Oui. Le sucre et les slogans sont venus après. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 330, 190); voix(R, ['s07b'], t); voix(M, ['s07a'], t);
  R.look = [.9, .1]; M.look = [.9, .1];
  if (la >= 0 && lb < 0) { M.handR = [150, -580]; M.poseR = 'ouverte'; M.sourcil = 1; }
  if (lb >= 0) { R.handR = [220, -560]; R.poseR = 'ouverte'; R.look = [.6, .3]; R.sourire = .5; M.look = [.8, .2]; }
  nbEtCouleur(c, t, [[0, 560, 430, 1.12], [DUREE, 560, 430, 1.15]], (cc) => { cuisineFloconsNB(cc, t, {}); boiteNB(cc, 860, 520, .55, { simple: true }); boiteNB(cc, 980, 520, .55, { sucre: true, slogan: true }); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
