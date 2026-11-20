// SCÈNE 12 — Plans 22-23. Le mouton regarde de nouveau les habitants et les flèches d'écho : « L'unanimité peut être un simple écho. »
// De nouveaux chemins s'ouvrent vers d'autres villages : « Les habitants diversifient leurs informations. »
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  if (lb < -.1) { const [R, M] = herosTV(t, 200, 520); voix(M, ['s12a'], t); M.face = 1; M.look = [.8, -.4]; M.froncer = .3; R.look = [.8, -.2];
    nbEtCouleur(c, t, [[0, 540, 420, 1.0]], (cc) => { valleeNB(cc, t, { ouvert: true }); ECHOS.forEach(([x, y, txt], k) => echo(cc, 620, 420, x, y, ((t * .4 + k * .33) % 1), txt)); }, (cc) => heros(cc, R, M)); debutFlash(c, t); return; }
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); valleeNB(cc, t, { ouvert: true }); const u = seg(lb, 0, B[1]);
    [[60, 380], [380, 260], [700, 250], [1040, 380]].forEach(([x, y], k) => { const v = clamp(u * 4 - k); if (v <= 0) return; ink(cc, 6, GRIS.blanc); cc.setLineDash([16, 10]); cc.beginPath(); cc.moveTo(540, 600); cc.lineTo(lerp(540, x, v), lerp(600, y, v)); cc.stroke(); cc.setLineDash([]); if (v >= 1) { F(cc, ell(x, y, 24, 24), GRIS.blanc, 3); cc.font = 'bold 14px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText(['Val', 'Bourg', 'Haut', 'Gué'][k], x, y + 5); } }); });
  debutFlash(c, t);
}
