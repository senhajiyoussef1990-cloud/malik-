// SCÈNE 07 — Plans 12-13 (TV + héros). La grande affiche se déroule : « BUVEZ UNE ORANGE ! » — le publicitaire, bras ouverts : « Buvez une orange ! Voilà notre slogan. »
// Le mouton, en couleur, effaré : « Boire une orange ? On en avale trois sans s'en rendre compte ! »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 330, 190); voix(M, ['s07b'], t);
  R.look = [.9, -.2]; M.look = [.9, -.3];
  if (lb >= 0) { M.handL = [-150, -620]; M.handR = [150, -620]; M.poseL = M.poseR = 'ouverte'; M.sourcil = 1; M.look = [.6, 0]; R.look = [-.6, .1]; R.sourire = .5; }
  nbEtCouleur(c, t, [[0, 600, 400, 1.1], [DUREE, 580, 410, 1.12]], (cc) => {
    const Pu = voix(PUBLICITAIRE(t, 520, { face: 1, look: [.6, -.3], sourire: 1 }), ['s07a'], t);
    if (la >= 0 && lb < 0) { Pu.handL = [-200, -720]; Pu.handR = [200, -720]; Pu.poseL = Pu.poseR = 'ouverte'; }
    agenceNB(cc, t, { affiche: seg(la, 0, 1.2), derriere: (c2) => dessine(c2, Pu, drawVendeur) });
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
