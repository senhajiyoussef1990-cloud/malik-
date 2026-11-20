// SCÈNE 10 — Plans 18-19 (TV + héros). Le renard compare les conditions écrites des deux stands : « La différence ? Des conditions claires et vérifiables. »
// Le mouton note la référence et le prix de la casserole : « Je peux prendre cinq minutes pour comparer. »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 300, 820); voix(R, ['s10a'], t); voix(M, ['s10b'], t);
  if (la >= 0) { R.handR = [200, -660]; R.poseR = 'pointe'; R.handL = [-200, -660]; R.poseL = 'pointe'; R.look = [Math.sin(t * 2) * .9, -.2]; }
  M.handL = [-60, -520]; M.handR = [40 + Math.sin(t * 14) * 6 * (lb >= 0), -540]; M.poseL = 'ouverte'; M.poseR = 'poing'; M.look = [0, .7];
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => {
    cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H);
    cc.save(); cc.translate(-20, 60); cc.scale(.5, .5); standNB(cc, t, { panneau: 1, sablier: .5 }); cc.restore();
    cc.save(); cc.translate(560, 60); cc.scale(.5, .5); standFrais(cc, t); cc.restore();
    cc.font = 'bold 22px Georgia'; cc.fillStyle = GRIS.noir; cc.textAlign = 'center'; cc.fillText('conditions : aucune', 250, 520); cc.fillText('conditions : date écrite', 830, 520);
  }, (cc) => { heros(cc, R, M); const a = mainScene(M, -1), b = mainScene(M, 1); carnet(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 30, .55, [['casserole', seg(lb, .2, 1)], ['9 F', seg(lb, 1, 1.6)]], 1, .05); });
  debutFlash(c, t);
}
