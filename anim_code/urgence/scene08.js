// SCÈNE 08 — Plans 14-15 (TV + héros). Le sablier se vide ; le vendeur retire le panneau… puis en sort un autre, identique.
// Le mouton ouvre grand les yeux : « La dernière chance revient déjà ? »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 700, 900); voix(M, ['s08b'], t); R.face = -1; R.look = [.6, -.3]; R.lid = .55;
  M.look = [-.7, -.6]; if (lb >= 0) { M.sourcil = 1; M.lid = 0; M.oreille = .3; M.handR = [140, -620]; M.poseR = 'ouverte'; }
  const retire = seg(la, .2, .9), ressort = seg(la, A[1] * .6, A[1] * .6 + .6);
  const pan = ressort > 0 ? ease(ressort) : 1 - ease(retire);
  nbEtCouleur(c, t, [[0, 560, 400, 1.15], [DUREE, 560, 420, 1.15]], (cc) => {
    standNB(cc, t, { panneau: pan, sablier: ressort > 0 ? 0 : clamp(.95 + la * .05) });
    const V = VENDEUR(t, 400, { face: 1, sourire: 1.3, look: [.6, -.6], handR: [160, -760], handL: [-40, -760], poseL: 'ouverte', poseR: 'ouverte' }); dessine(cc, V, drawVendeur);
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
