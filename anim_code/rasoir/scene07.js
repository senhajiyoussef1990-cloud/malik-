// SCÈNE 07 — Plans 12-13 (TV + héros). Au grand bal, une cliente en robe serre ses bras contre elle : « Mon Dieu, et si quelqu’un voyait mes bras au bal ? »
// Le mouton (en couleur) : « Hier, personne n’y pensait. Et maintenant, c’est la honte ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  const [R, M] = herosTV(t, 300, 170); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [.7, -.2]; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [-.6, .1]; R.sourcil = .5; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.12], [DUREE, 600, 420, 1.15]], (cc) => { const Cl = voix(CLIENTE(t, 760, { face: -1, look: [-.5, .3], froncer: .8, sourcil: 1, handL: [30, -560], handR: [-30, -560], poseL: 'poing', poseR: 'poing' }), ['s07a'], t); balNB(cc, t, { derriere: (c2) => dessine(c2, Cl) }); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
