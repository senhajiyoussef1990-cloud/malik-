// SCÈNE 10 — Plans 18-19 (TV + héros). Le mouton compare les titres du diplôme à une liste de compétences : « La compétence dépend du sujet, aussi. »
// Le renard acquiesce devant une vraie technicienne : « Oui. Une expertise réelle peut aider. »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 200, 860); voix(R, ['s10b'], t); voix(M, ['s10a'], t);
  M.handL = [-150, -560]; M.handR = [60, -560]; M.poseL = M.poseR = 'poing'; M.look = [Math.sin(t * 2.4) * .8, .2]; M.froncer = .5;
  if (lb >= 0) { R.tilt = Math.sin(lb * 6) * .06; R.look = [.8, 0]; R.sourire = .9; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.0]], (cc) => {
    cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H);
    diplome(cc, 300, 260, .8);
    F(cc, poly([[620, 140], [900, 140], [900, 400], [620, 400]]), GRIS.blanc, 3); cc.font = 'bold 20px Georgia'; cc.fillStyle = GRIS.noir; cc.textAlign = 'left'; cc.fillText('Compétences réelles :', 640, 180); cc.font = '18px Georgia'; ['• mémoire : ?', '• nutrition : ?', '• études publiées : ?'].forEach((l, k) => cc.fillText(l, 650, 230 + k * 50));
    if (lb >= 0) dessine(cc, figurant(t, 540, 1, { s: .5, y: 790, face: 1, tablier: 'blanc', look: [.6, 0], sourire: .8, handR: [150, -620], poseR: 'ouverte' }));
  }, (cc) => { heros(cc, R, M); lunettesMouton(cc, M); });
  debutFlash(c, t);
}
