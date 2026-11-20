// SCÈNE 07 — Plans 12-13 (TV + héros). L'industriel au monocle déroule le barème des amendes au-dessus de la table : « Et celui qui fabrique des ampoules trop solides paiera une amende ! »
// Le mouton (en couleur, près de la fenêtre) n'en revient pas : « Une amende… pour avoir fait du bon travail ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 800, 925); voix(M, ['s07b'], t);
  R.face = -1; M.face = -1; R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, 0]; M.handR = [150, -600]; M.poseR = 'ouverte'; M.sourcil = 1; M.froncer = .5; R.look = [-.6, .1]; R.lid = .5; }
  nbEtCouleur(c, t, [[0, 560, 420, 1.12], [DUREE, 570, 420, 1.15]], (cc) => {
    const I = voix(INDUSTRIEL(t, 420, 0, { face: 1, look: [.5, -.2], sourire: .9, sourcil: .5 }), ['s07a'], t);
    if (la >= 0) { I.handL = [-60, -760]; I.handR = [160, -760]; I.poseL = I.poseR = 'poing'; }
    geneveNB(cc, t, { derriere: (c2) => { dessine(c2, INDUSTRIEL(t, 200, 2, { s: .46, face: 1, look: [.7, 0] })); dessine(c2, I); dessine(c2, INDUSTRIEL(t, 660, 3, { s: .46, face: -1, look: [-.7, 0], sourire: .5 })); } });
    if (la >= 0) { const h = mainF(I, -1), h2 = mainF(I, 1), u = ease(seg(la, .1, 1)); cc.save(); cc.translate((h[0] + h2[0]) / 2, h[1] + 10); cc.beginPath(); cc.rect(-170, 0, 340, 300 * u); cc.clip(); cc.translate(-540 * .36, -60 * .36); cc.scale(.36, .36); bareme(cc, t, seg(la, .6, A[1] + .5)); cc.restore(); ink(cc, 6, GRIS.noir); cc.beginPath(); cc.moveTo(h[0], h[1] + 6); cc.lineTo(h2[0], h2[1] + 6); cc.stroke(); }
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
