// SCÈNE 05 — QUIZ : le renard pose la question au spectateur, deux réponses, compte à rebours.
const A = L.s05a, PAUSE = 3.0, DUREE = A[0] + A[1] + PAUSE + .5;
const Q = {"q": ["Pourquoi les frais arrivent-ils", "seulement à la fin ?"], "A": ["Par simple oubli"], "B": ["Pour que tu n’oses plus", "faire demi-tour"], "bonne": "B"};
function carteQuiz(cc, t, rev) {
  cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir;
  cc.font = 'bold 46px Georgia'; cc.fillText('À TON AVIS ?', 540, 100); cc.font = 'italic bold 30px Georgia'; Q.q.forEach((l, i) => cc.fillText(l, 540, 160 + i * 40));
  ['A', 'B'].forEach((k, i) => { const y = 300 + i * 190, ok = rev && Q.bonne === k;
    F(cc, poly([[150, y], [930, y], [930, y + 150], [150, y + 150]]), ok ? GRIS.noir : GRIS.blanc, 5);
    F(cc, ell(230, y + 75, 46, 46), ok ? GRIS.blanc : GRIS.noir, 0); cc.fillStyle = ok ? GRIS.noir : GRIS.blanc; cc.font = 'bold 50px Georgia'; cc.fillText(k, 230, y + 93);
    cc.textAlign = 'left'; cc.fillStyle = ok ? GRIS.blanc : GRIS.noir; cc.font = 'bold 34px Georgia'; Q[k].forEach((l, j) => cc.fillText(l, 310, y + 70 + j * 42 - (Q[k].length - 1) * 21)); cc.textAlign = 'center'; });
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], fin = A[0] + A[1], p = t - fin;
  const [R, M] = herosTV(t, 130, 950); voix(R, ['s05a'], t);
  R.face = 1; R.look = [.4, .1]; M.face = -1; M.look = [-.6, -.3]; M.sourcil = 1; M.froncer = .4;
  if (la >= 0 && p < 0) { R.handR = [190, -660]; R.poseR = 'pointe'; R.sourcil = .7; }
  if (p >= 0) { M.tilt += Math.sin(t * 5) * .06; R.look = [0, 0]; R.sourire = .9; }
  nbEtCouleur(c, t, [[0, 540, 405, 1.0], [DUREE, 540, 405, 1.04]], (cc) => carteQuiz(cc, t, false), (cc) => heros(cc, R, M));
  if (p >= 0 && p < PAUSE) { const n = 3 - Math.floor(p / (PAUSE / 3)), f = (p % (PAUSE / 3)) / (PAUSE / 3);
    c.setTransform(1, 0, 0, 1, 0, 0); c.save(); c.globalAlpha = 1 - f * .6; c.translate(W / 2, H / 2 + 60); c.scale(1.4 - f * .5, 1.4 - f * .5);
    F(c, ell(0, -40, 110, 110), 'rgba(255,210,58,.95)', 6); c.fillStyle = '#141210'; c.font = 'bold 140px Georgia'; c.textAlign = 'center'; c.fillText(String(n), 0, 8); c.restore(); }
  debutFlash(c, t);
}
