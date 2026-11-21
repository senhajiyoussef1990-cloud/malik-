// SCÈNE 11 — Plans 20-21 (TV + héros). Dans les allées, le mouton (en couleur), dépité : « Donc je suis un rat dans un labyrinthe à caddies ? »
// Le renard sort une petite liste de sa poche : « Un peu. Mais un rat qui a une liste peut sortir plus vite. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 640, 400); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.froncer = .6; M.sourcil = .9; }
  if (lb >= 0) { R.handR = [150, -620]; R.poseR = 'poing'; R.sourire = .7; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 600, 400, 1.12], [DUREE, 620, 400, 1.15]], (cc) => libreServiceNB(cc, t), (cc) => { heros(cc, R, M); if (lb >= 0) { const a = mainScene(R, 1); cc.save(); cc.translate(a[0], a[1] - 30); cc.rotate(.1); F(cc, poly([[-26, -40], [26, -40], [26, 40], [-26, 40]]), '#fbf6ea', 2); for (let k = 0; k < 4; k++) { ink(cc, 1.5, '#3a3a6a'); cc.beginPath(); cc.moveTo(-18, -24 + k * 16); cc.lineTo(16, -24 + k * 16); cc.stroke(); } cc.restore(); } });
  debutFlash(c, t);
}
