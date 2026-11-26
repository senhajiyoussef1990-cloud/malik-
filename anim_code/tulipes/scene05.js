// SCÈNE 06 — la réponse (le renard), puis le mécanisme (narrateur).
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .4;
const Q = {"q": ["Un matin de février 1637,", "que s’est-il passé ?"], "A": ["Le prix a encore doublé"], "B": ["Plus personne", "n’est venu acheter"], "bonne": "B"}, XB = ((cc, t, u) => courbe(cc, t, u, {}));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 130, 950); voix(R, ['s06a'], t); R.face = 1; R.look = [.6, 0]; R.handR = [190, -640]; R.poseR = 'ouverte'; R.sourire = .7; M.face = -1; M.look = [-.6, -.1]; M.sourcil = 1.2; M.sourire = .2;
    nbEtCouleur(c, t, [[0, 540, 405, 1.18], [B[0], 540, 405, 1.1]], (cc) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.font = 'bold 46px Georgia'; cc.fillText('RÉPONSE ' + Q.bonne, 540, 110);
      F(cc, poly([[150, 260], [930, 260], [930, 470], [150, 470]]), GRIS.noir, 5); cc.fillStyle = GRIS.blanc; cc.font = 'bold 38px Georgia'; Q[Q.bonne].forEach((l, j) => cc.fillText(l, 540, 360 + j * 48 - (Q[Q.bonne].length - 1) * 24)); }, (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.06]]); XB(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
