// SCÈNE 06 — Plans 10-11. Plan d'ensemble : une seule personne au centre, trois flèches d'écho. « En réalité, c'est une seule source. »
// Le mouton examine le plan, étonné : « Ils ont confondu trois échos et trois témoins ! »
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function plan(cc, t, u) {
  cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); F(cc, poly([[140, 80], [940, 80], [940, 620], [140, 620]]), '#f2efe4', 5);
  for (const [x, y] of [[260, 200], [820, 190], [540, 150]]) { F(cc, poly([[x - 70, y + 40], [x, y - 40], [x + 70, y + 40]]), GRIS.moyen, 3); }
  F(cc, ell(540, 460, 16, 16), GRIS.noir, 2); cc.font = 'bold 22px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('1 seule voix', 540, 510);
  [[260, 240], [820, 230], [540, 190]].forEach(([x, y], k) => { const v = clamp(u * 3 - k); if (v <= 0) return; ink(cc, 4, GRIS.noir); cc.beginPath(); cc.moveTo(540, 440); cc.lineTo(lerp(540, x, v), lerp(440, y, v)); cc.stroke(); ink(cc, 4, GRIS.fonce); cc.setLineDash([10, 8]); cc.beginPath(); cc.moveTo(x, y); cc.lineTo(lerp(x, 540, v), lerp(y, 440, v) + 30); cc.stroke(); cc.setLineDash([]); cc.font = 'italic 18px Georgia'; cc.fillText('écho ' + (k + 1), x, y + 70); });
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0], u = seg(t, A[0] + .2, A[0] + A[1]);
  if (lb < -.1) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); plan(cc, t, u); }); debutFlash(c, t); return; }
  const [R, M] = herosTV(t, 160, 900); voix(M, ['s06b'], t); M.look = [-.6, -.3]; M.sourcil = 1; M.oreille = .3; M.handR = [-140, -640]; M.poseR = 'pointe'; R.sourire = .6;
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => plan(cc, t, 1), (cc) => heros(cc, R, M));
}
