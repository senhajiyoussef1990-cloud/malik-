// SCÈNE 07 — Plans 12-13 (TV + héros). La demoiselle d'honneur, son bouquet fané, soupire : « Toujours demoiselle d'honneur, jamais la mariée… Pourquoi ? »
// Le mouton (en couleur, sur les marches de l'église) chuchote au renard : « Parce qu'elle a mauvaise haleine ? C'est ça, la réclame ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 300, 170); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [.7, -.2]; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [-.6, .1]; R.sourcil = .5; }
  nbEtCouleur(c, t, [[0, 600, 420, 1.12], [DUREE, 600, 420, 1.15]], (cc) => { const Dm = voix(DEMOISELLE(t, 760, { face: -1, look: [-.3, .2], froncer: .7, handL: [-40, -560], poseL: 'poing' }), ['s07a'], t); noceNB(cc, t, { derriere: (c2) => dessine(c2, Dm) }); const h = mainF(Dm, -1); for (let k = 0; k < 4; k++) F(cc, ell(h[0] - 10 + k * 7, h[1] - 30 + (k % 2) * 6, 8, 8), GRIS.moyen, 1); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
