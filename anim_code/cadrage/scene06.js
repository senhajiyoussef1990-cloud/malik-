// SCÈNE 06 — Plans 10-11 (TV + héros en couleur). À la table de rédaction, le mouton prend les deux clichés côte à côte :
// « Mais aucune ne montre toute la place. » Le renard encadre au crayon ce que chaque photo a laissé dehors.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0], R = voix(renardBase(t), ['s06b'], t), M = voix(moutonBase(t), ['s06a'], t);
  R.x = 250; R.y = 800; R.s = .5; M.x = 830; M.y = 810; M.s = .47; R.look = [.8, .4]; M.look = [-.8, .4];
  if (la >= 0) { M.handL = [-150, -520]; M.poseL = 'ouverte'; M.froncer = .7; }
  const u = seg(lb, 0, B[1]);
  if (lb >= 0) { R.handR = [260 + u * 200, -520 + Math.sin(u * 12) * 30]; R.poseR = 'pointe'; R.lean = .08; }
  nbEtCouleur(c, t, [[0, 540, 470, 1.1], [DUREE, 540, 470, 1.15]], (cc) => {
    redaction(cc, t);
    photo(cc, 420, 560, 260, 'fete', -.04); photo(cc, 680, 560, 240, 'flaque', .05);
    if (lb >= 0) { ink(cc, 5, GRIS.noir); const p = Math.min(1, u * 2); cc.beginPath(); cc.moveTo(560, 470); cc.lineTo(560, 470 + 180 * p); cc.stroke(); const q = clamp(u * 2 - 1); cc.beginPath(); cc.moveTo(550, 470); cc.lineTo(550, 470 + 180 * q); cc.stroke();
      cc.save(); cc.font = 'italic bold 22px Georgia'; cc.fillStyle = GRIS.noir; cc.globalAlpha = q; cc.fillText('hors champ ?', 470, 450); cc.restore(); }
  }, (cc) => { for (const P of [R, M]) { cc.save(); cc.translate(0, -P.bob); (P === R ? drawRenard : drawMouton)(cc, P); cc.restore(); } if (lb >= 0) { const [hx, hy] = mainScene(R, 1); crayon(cc, hx, hy - 10, 2.6); } });
  debutFlash(c, t);
}
