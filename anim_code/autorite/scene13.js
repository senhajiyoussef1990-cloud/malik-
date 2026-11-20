// SCÈNE 13 — Plan 24 (TV + héros). Le renard désigne le carnet de questions rempli par le public : « Questionner n'est pas manquer de respect. »
const A = L.s13a, DUREE = A[0] + A[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 300, 820); voix(R, ['s13a'], t); R.handR = [220, -600]; R.poseR = 'pointe'; R.sourire = .8; M.look = [-.6, .2]; M.sourire = .8;
  nbEtCouleur(c, t, [[0, 540, 420, 1.05]], (cc) => {
    auditoriumNB(cc, t, { rideau: 1, diplome: 1, pupitre: 1, dossiers: 8 });
    cc.save(); cc.translate(560, 380); F(cc, poly([[-150, -120], [150, -120], [150, 120], [-150, 120]]), GRIS.blanc, 4); cc.font = 'bold 22px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('QUESTIONS DU PUBLIC', 0, -84); cc.font = 'italic 17px Georgia'; cc.textAlign = 'left'; ['Quelle méthode ?', 'Combien de personnes testées ?', 'Qui a vérifié ?', 'Quelles limites ?'].forEach((l, k) => cc.fillText('– ' + l, -130, -40 + k * 38)); cc.restore();
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
