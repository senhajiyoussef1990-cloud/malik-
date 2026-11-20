// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard compte sur ses doigts : « Le nom, l'image, et l'histoire qu'on raconte autour. »
// s08b : gros plan : l'étiquette « SAKÉ » est barrée et remplacée par « SĀMON », sur le même poisson.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) {
    const [R, M] = herosTV(t, 330, 190); voix(R, ['s08a'], t); R.look = [-.8, 0]; M.look = [.8, 0];
    if (la >= 0) { const n = Math.floor(seg(la, 0, A[1]) * 3); R.handL = [-120, -660]; R.poseL = n >= 1 ? 'ouverte' : 'pointe'; R.handR = [200, -620]; R.poseR = 'pointe'; R.sourire = .8; M.oreille = .3; }
    nbEtCouleur(c, t, [[0, 540, 450, 1.15]], (cc) => ministereNB(cc, t, { derriere: (c2) => dessine(c2, DELEGUE(t, 760, { face: -1, look: [-.6, .4], sourire: 1 }), drawVendeur) }), (cc) => heros(cc, R, M));
  } else {
    enNoirEtBlanc(c, t, (cc) => {
      cam(cc, t, [[B[0], 540, 420, 1.0], [DUREE, 540, 410, 1.05]]);
      cc.fillStyle = '#cfcbc1'; cc.fillRect(0, 0, W, H); F(cc, poly([[0, 560], [W, 560], [W, H], [0, H]]), GRIS.fonce, 0);
      poissonNB(cc, 540, 560, 3.2, 0, { clair: 1 });
      etiquetteGeante(cc, 560, 250, 1.1, seg(lb, .2, B[1] * .8));
    });
  }
  debutFlash(c, t);
}
