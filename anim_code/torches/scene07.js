// SCÈNE 07 — Plans 12-13 (TV + héros). Dans un salon cossu, Bernays distribue des cigarettes à trois jeunes femmes en chapeau cloche, un plan de l'avenue punaisé au mur : « Mesdemoiselles, au défilé de Pâques… »
// Le mouton (en couleur, près de la porte) se penche vers le renard : « Il a recruté des jeunes femmes pour fumer en public ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 310, 180); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [.7, -.2]; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [-.6, .1]; R.sourcil = .6; }
  nbEtCouleur(c, t, [[0, 560, 430, 1.12], [DUREE, 560, 430, 1.15]], (cc) => {
    cc.fillStyle = '#d8d4ca'; cc.fillRect(0, 0, W, 640); damasNB(cc); cc.fillStyle = '#76726a'; cc.fillRect(0, 640, W, H - 640);
    F(cc, poly([[420, 90], [700, 90], [700, 300], [420, 300]]), GRIS.blanc, 4); ink(cc, 6, GRIS.moyen); cc.beginPath(); cc.moveTo(450, 280); cc.lineTo(670, 110); cc.stroke(); cc.font = 'bold 16px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('5e AVENUE', 560, 120); for (let k = 0; k < 3; k++) { F(cc, ell(480 + k * 70, 250 - k * 54, 10, 10), GRIS.noir, 0); } cc.fillText('X = vous', 640, 280);
    const Bn = voix(BERNAYS(t, 500, { face: 1, look: [.8, 0], chapeau: false, sourire: 1 }), ['s07a'], t);
    if (la >= 0 && lb < 0) { Bn.handR = [180, -620]; Bn.poseR = 'ouverte'; }
    dessine(cc, Bn, drawVendeur); const D = [DEBUTANTE(t, 720, 0, { face: -1, look: [-.8, 0] }), DEBUTANTE(t, 840, 1, { face: -1, look: [-.8, -.1], sourire: 1 }), DEBUTANTE(t, 960, 2, { face: -1, look: [-.8, 0] })];
    if (la > A[1] * .6) D.forEach((d, k) => { d.handR = [-60, -640]; d.poseR = 'poing'; d.sourire = 1; d.tilt += Math.sin(t * 5 + k) * .03; });
    D.forEach(d => dessine(cc, d)); if (la > A[1] * .6) D.forEach(d => { const h = mainF(d, 1); cigaretteNB(cc, h[0], h[1] - 6, .5, -2.6, 0); });
    const h = mainF(Bn, 1); if (la >= 0) paquetNB(cc, h[0] + 10, h[1] - 10, .4, 'LIBERTÉ');
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
function damasNB(c) { for (let y = 20; y < 440; y += 60) for (let x = (y / 60 % 2) * 40; x < W; x += 80) { c.fillStyle = 'rgba(0,0,0,.05)'; c.beginPath(); c.ellipse(x, y, 14, 22, 0, 0, 7); c.fill(); } F(c, poly([[0, 440], [W, 440], [W, 640], [0, 640]]), '#a8a49a', 2); }
