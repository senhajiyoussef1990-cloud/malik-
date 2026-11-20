// SCÈNE 13 — Plan 24 (TV + héros). Devant la vieille affiche « BACON SUPRÊME » jaunie, le renard sourit : « Une tradition, parfois, c'est juste une réclame qui a vieilli. » Le mouton regarde l'affiche, songeur.
const A = L.s13a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 760); voix(R, ['s13a'], t);
  R.look = [-.5, -.5]; M.look = [-.9, -.6]; M.oreille = .2; M.froncer = .3;
  if (la >= 0) { R.handL = [-230, -720]; R.poseL = 'pointe'; R.sourire = .7; }
  if (la > A[1] * .6) { R.look = [.9, 0]; R.handL = [-104, -440]; R.poseL = 'repos'; M.look = [-.9, 0]; M.sourire = .6; M.froncer = 0; }
  nbEtCouleur(c, t, [[0, 520, 330, 1.3], [DUREE, 540, 360, 1.22]], (cc) => {
    bureauNB(cc, t, { ventes: 1 }); cc.fillStyle = 'rgba(120,110,90,.22)'; cc.fillRect(430, 160, 170, 220);   // l'affiche jaunie
    ink(cc, 2, 'rgba(0,0,0,.4)'); cc.beginPath(); cc.moveTo(600, 160); cc.lineTo(570, 190); cc.lineTo(600, 196); cc.stroke();   // coin décollé
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
