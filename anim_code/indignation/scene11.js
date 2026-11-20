// SCÈNE 11 — Plans 20-21. Le renard remet les trois photos dans l'ordre : « La chronologie protège contre les conclusions hâtives. »
// Le rédacteur publie un rectificatif sobre, en bas de la page suivante : « La correction est moins spectaculaire. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < -.1) { const [R, M] = herosTV(t, 160, 920); voix(R, ['s11a'], t); R.handR = [260, -600]; R.poseR = 'pointe'; M.look = [-.6, -.2];
    const o = ease(seg(la, .2, A[1])), pos = [[[790, 370], [250, 370], [520, 370]], [[250, 370], [520, 370], [790, 370]]];
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); [0, 1, 2].forEach((m) => { const [x0, y0] = pos[0][m], [x1, y1] = pos[1][m]; photoMoment(cc, lerp(x0, x1, o), lerp(y0, y1, o) - Math.sin(o * Math.PI) * 60 * (m === 0 ? 1 : 0), 240, m, 0); }); if (o >= 1) { ink(cc, 4, GRIS.noir); cc.beginPath(); cc.moveTo(160, 560); cc.lineTo(900, 560); cc.lineTo(880, 548); cc.moveTo(900, 560); cc.lineTo(880, 572); cc.stroke(); cc.font = 'italic 20px Georgia'; cc.fillStyle = GRIS.noir; cc.fillText('9 h 00', 230, 600); cc.fillText('9 h 01', 500, 600); cc.fillText('9 h 02', 770, 600); } }, (cc) => heros(cc, R, M)); debutFlash(c, t); return; }
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0], [DUREE, 540, 560, 1.6]]); redaction(cc, t); une(cc, 540, 410, 1.0, 'LES ÉCHOS DU MARCHÉ', 0, { taille: 24, rectif: true }); });
  debutFlash(c, t);
}
