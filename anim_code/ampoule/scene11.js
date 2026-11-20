// SCÈNE 11 — Plans 20-21 (TV + héros). Sous la vieille ampoule de la caserne, le mouton (en couleur) lève les yeux : « Donc la panne était prévue d'avance ? »
// Le renard pose une ampoule « 1 000 h » à côté d'un sablier : « Pour celles-là, oui. On appelle ça l'obsolescence programmée. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 960, 700); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.4, -.8]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -600]; M.poseR = 'ouverte'; M.sourcil = 1; }
  if (lb >= 0) { R.handR = [130, -620]; R.poseR = 'poing'; R.sourcil = .5; M.look = [.9, -.1]; }
  nbEtCouleur(c, t, [[0, 780, 380, 1.2], [DUREE, 800, 380, 1.24]], (cc) => caserneNB(cc, t, {}), (cc) => { heros(cc, R, M); if (lb >= 0) { const h = mainScene(R, 1); ampouleC(cc, h[0] - 6, h[1] - 30, .45, -.1, 0); cc.font = 'bold 14px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#fff2b0'; cc.fillText('1 000 h', h[0] - 6, h[1] + 20); } });
  debutFlash(c, t);
}
