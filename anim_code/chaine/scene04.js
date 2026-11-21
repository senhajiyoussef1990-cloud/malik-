// SCÈNE 04 — plongée dans le poste : le zapping en noir et blanc, puis la question à se poser
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6, ZD = 1.0;
const ZL = ['saumon', 'reduflation', 'martiens', 'filtres', 'euphemisme', 'overton', 'cowboy', 'bacon'];
function question(cc, t, u) { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.font = 'bold 34px Georgia'; cc.fillText('LA QUESTION À SE POSER', 540, 160);
  F(cc, poly([[150, 260], [930, 260], [930, 560], [150, 560]]), GRIS.blanc, 5); cc.fillStyle = GRIS.noir; cc.font = 'italic bold 44px Georgia'; const l = ['Qui a intérêt', 'à ce que je le croie ?']; l.forEach((s, k) => { cc.globalAlpha = clamp(u * 3 - k); cc.fillText(s, 540, 380 + k * 80); }); cc.globalAlpha = 1;
  cc.font = 'bold 120px Georgia'; cc.fillText('?', 540 + Math.sin(t * 3) * 6, 730); }
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (t < ZD) { const R = renardBase(t), M = moutonBase(t); R.x = 345; R.look = [-1, .3]; M.x = 718; M.look = [-1, .2]; c.save(); camEcran(c, ease(t / ZD), [540, 420, 1.3]); dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => ZAP.saumon(cc, tt), derriere: (cc) => tablePetitDej(cc, { tasse: 1, t }) }); c.restore(); flash(c, ease(seg(t, ZD - .25, ZD))); return; }
  const lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) { zap(cc, t - ZD, ZL, Math.max(.9, (B[0] - ZD) / ZL.length)); plaqueEpoque(cc, 'Une vraie histoire d’autrefois', clamp((t - ZD) * 2)); } else question(cc, t, seg(lb, 0, B[1] * .7)); });
  debutFlash(c, t - ZD);
}
