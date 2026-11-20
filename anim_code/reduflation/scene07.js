// SCÈNE 07 — Plans 12-13 (TV + héros). À l'épicerie, le mouton (en couleur) regarde la cliente repartir avec son paquet : « Mais elle ne voit rien du tout ! »
// Le renard tapote l'étiquette du prix sur l'étagère, puis le dos du paquet : « Parce qu'on regarde le prix, jamais le poids. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 330, 190); voix(R, ['s07b'], t); voix(M, ['s07a'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -580]; M.poseR = 'ouverte'; M.sourcil = 1; M.froncer = .6; }
  if (lb >= 0) { R.handR = [240, -720]; R.poseR = 'pointe'; R.look = [.6, -.5]; R.sourcil = .5; M.look = [.7, -.4]; }
  nbEtCouleur(c, t, [[0, 560, 430, 1.12], [DUREE, 560, 430, 1.15]], (cc) => {
    const Cl = marche(CLIENTE(t, lerp(620, 1150, seg(la, 0, A[1] + 1)), { face: 1, look: [.8, 0], sourire: 1, handR: [100, -500], poseR: 'poing' }), t, 7);
    epicerieNB(cc, t, { n: 13, derriere: (c2) => dessine(c2, figurant(t, 760, 3, { face: -1, s: .5, y: 790, look: [-.8, 0], tablier: 'blanc' })), devant: (c2) => { dessine(c2, Cl); const h = mainF(Cl, 1); paquetNB(c2, h[0] + 10, h[1] - 20, .3, { n: 13 }); } });
    etiquette(cc, 560, 270, '2 F', 1, -.05);
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
