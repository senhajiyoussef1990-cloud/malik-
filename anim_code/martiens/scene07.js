// SCÈNE 07 — Plans 12-13 (TV + héros). Dans le salon de 1938, à côté de la radio, le mouton (en couleur) : « Mais c'est une fiction ! Ils l'ont annoncé au début ? »
// Le renard montre la pendule (20 h 00 → 20 h 12) et un voisin qui entre en retard, tournant le bouton du poste : « Oui. Mais ceux qui arrivent en cours de route ne l'ont pas entendu. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 300, 175); voix(R, ['s07b'], t); voix(M, ['s07a'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -580]; M.poseR = 'ouverte'; M.sourcil = 1; }
  if (lb >= 0) { R.handR = [240, -720]; R.poseR = 'pointe'; R.look = [.6, -.5]; M.look = [.7, -.2]; }
  nbEtCouleur(c, t, [[0, 560, 420, 1.1], [DUREE, 570, 420, 1.12]], (cc) => {
    const V = figurant(t, lerp(1100, 900, ease(seg(lb, 0, 1.2))), 2, { s: .48, y: 790, face: -1, look: [-.8, 0], chapeau: COIFFE.casquette }); if (lb >= 0 && seg(lb, 0, 1.2) < 1) marche(V, t, 8); if (lb > 1.2) { V.handR = [-80, -540]; V.poseR = 'pointe'; V.sourcil = 1; }
    salon38NB(cc, t, { derriere: (c2) => { dessine(c2, PERE(t, 420, { face: 1, look: [.8, .1], froncer: .5 })); if (lb >= 0) dessine(c2, V); } });
    F(cc, ell(540, 200, 44, 44), GRIS.blanc, 4); ink(cc, 3); const m = lb >= 0 ? 12 * ease(seg(lb, .3, 1.5)) : 0; cc.beginPath(); cc.moveTo(540, 200); cc.lineTo(540 + Math.sin(m / 60 * 6.28) * 32, 200 - Math.cos(m / 60 * 6.28) * 32); cc.moveTo(540, 200); cc.lineTo(540, 176); cc.stroke(); cc.font = 'bold 18px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('20 h ' + String(Math.round(m)).padStart(2, '0'), 540, 270);
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
