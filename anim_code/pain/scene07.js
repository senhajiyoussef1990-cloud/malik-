// SCÈNE 07 — Plans 12-13 (TV + héros). Un client, une seule ampoule sur sa liste, renifle et se sert partout : « Tiens, je vais prendre des croissants, et des gâteaux, et du fromage… »
// Le mouton (en couleur) : « Il ne venait acheter qu’une ampoule ! »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 950, 820); voix(M, ['s07b'], t); R.face = -1; M.face = -1;
  R.look = [-.9, 0]; M.look = [-.9, 0];
  if (lb >= 0) { M.handR = [140, -620]; M.poseR = 'pointe'; M.sourcil = 1; M.look = [-.8, -.2]; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.0], [DUREE, 560, 420, 1.04]], (cc) => grandMagasinNB(cc, t, { four: 1, odeur: 1, derriere: (c2) => { const C2 = voix(CLIENT(t, 560, { face: 1, look: [.3, -.5], sourire: 1, handR: [70, -460], poseR: 'poing', handL: [-120, -700], poseL: 'pointe' }), ['s07a'], t); C2.tilt -= .06; dessine(c2, C2); const h = mainF(C2, 1); F(c2, poly([[h[0] - 40, h[1] + 40], [h[0] + 40, h[1] + 40], [h[0] + 48, h[1] - 10], [h[0] - 48, h[1] - 10]]), GRIS.moyen, 3); for (let k = 0; k < Math.floor(seg(la, 0, A[1]) * 6); k++) produitPain(c2, h[0] - 36 + k * 15, h[1] - 8, k); } }), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
