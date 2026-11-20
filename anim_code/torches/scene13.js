// SCÈNE 13 — Plan 24 (TV + héros). Devant le grand magasin, sous l'affiche « LIBERTÉ » qui se décolle, le renard écrase une cigarette du bout du pied : « On t'a vendu une cigarette, pas la liberté. » Le mouton hoche la tête.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 680); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; M.oreille = .2;
  if (la >= 0) { R.handL = [-200, -620]; R.poseL = 'ouverte'; R.sourire = .5; }
  if (la > A[1] * .6) { M.tilt += Math.sin(t * 6) * .05; M.sourire = .7; R.look = [.9, 0]; }
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => { avenueNB(cc, t, {}); cc.save(); cc.translate(990, 300); cc.rotate(.06); F(cc, poly([[-80, -100], [80, -100], [80, 100], [-80, 100]]), GRIS.blanc, 3); cc.font = 'bold 26px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LIBERTÉ', 0, 70); F(cc, smooth([[-10, 50], [-24, 0], [-14, -50], [10, -40], [22, 50]]), GRIS.fonce, 1.5); F(cc, poly([[80, 100], [40, 100], [80, 60]]), GRIS.clair, 1.5); cc.restore(); cigaretteNB(cc, 470, 806, .7, .1, seg(la, 0, A[1]) < .3 ? 1 : 0, t); },
    (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
