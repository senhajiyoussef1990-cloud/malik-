// SCÈNE 11 — Plans 20-21. « S'éloigner un instant peut suffire » : le mouton va comparer dans deux boutiques voisines.
// « Le prix annoncé n'était pas exceptionnel » : les trois étiquettes s'alignent dans un tableau.
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < -.1) {
    const [R, M] = herosTV(t, 200, lerp(500, 980, ease(seg(la, 0, A[1] + .3)))); M.face = 1; M.look = [.9, 0]; if (la < A[1] + .3) { M.walk = t * 9; M.bob = Math.abs(Math.sin(t * 9)) * 6; } R.look = [.9, 0];
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { if (!_foireNB) _foireNB = fondFoire(); cc.drawImage(_foireNB, 0, 0);
      for (const [x, n, p] of [[320, 'QUINCAILLERIE', '9 F'], [760, 'BAZAR', '8 F']]) { F(cc, poly([[x - 140, 600], [x + 140, 600], [x + 140, 380], [x - 140, 380]]), GRIS.moyen, 4); F(cc, poly([[x - 120, 400], [x + 120, 400], [x + 120, 440], [x - 120, 440]]), GRIS.blanc, 2); cc.font = 'bold 20px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText(n, x, 428); F(cc, poly([[x - 100, 460], [x + 100, 460], [x + 100, 580], [x - 100, 580]]), '#4a4844', 2); casserole(cc, x - 20, 550, .6); etiquette(cc, x + 60, 520, p, .8); } }, (cc) => heros(cc, R, M));
  } else { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); tableauPrix(cc, t, seg(lb, 0, B[1])); }); }
  debutFlash(c, t);
}
