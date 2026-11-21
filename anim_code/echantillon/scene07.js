// SCÈNE 07 — Plans 12-13 (TV + héros). Le voyageur, sa fleur à la main, contrarié : « Je ne voulais pas de cette fleur… mais je me sentais obligé de donner. »
// Le mouton (en couleur), près de la poubelle : « Il ne voulait même pas de la fleur ! »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  const [R, M] = herosTV(t, 150, 300); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => aeroportNB(cc, t, { voyageurs: 0, derriere: (c2) => { const V = voix(VOYAGEUR(t, 680, { face: -1, look: [-.5, .3], froncer: .8, sourcil: .9, handR: [-120, -600], poseR: 'poing' }), ['s07a'], t); dessine(c2, V); const h = mainF(V, 1); fleurNB(c2, h[0], h[1] + 20, .6, -.6); poubelleFleurs(c2, 900, 790, .9, 12); } }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
