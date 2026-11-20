// SCÈNE 15 — Plan 25. « Le retour au salon change le regard. » L'objectif d'un appareil devient la vitre du téléviseur ; zoom arrière vers le salon.
const A = L.s15a, ZD = 1.3, DUREE = A[0] + A[1] + .6, Z0 = A[0] + A[1] * .3;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lentille = (cc, tt) => { placeFeteNB(cc, tt, {}); const r = 320; cc.save(); cc.fillStyle = 'rgba(0,0,0,.85)'; cc.beginPath(); cc.rect(0, 0, W, H); cc.moveTo(540 + r, 405); cc.arc(540, 405, r, 0, Math.PI * 2, true); cc.fill(); ink(cc, 14, GRIS.fonce); cc.beginPath(); cc.arc(540, 405, r, 0, 7); cc.stroke(); ink(cc, 3, GRIS.moyen); cc.beginPath(); cc.arc(540, 405, r + 18, 0, 7); cc.stroke(); cc.restore(); };
  if (t < Z0) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); const k = ease(seg(t, 0, Z0)); placeFeteNB(cc, t, {}); cc.fillStyle = `rgba(0,0,0,${.85 * k})`; cc.beginPath(); cc.rect(0, 0, W, H); cc.moveTo(540 + lerp(900, 320, k), 405); cc.arc(540, 405, lerp(900, 320, k), 0, Math.PI * 2, true); cc.fill(); }); debutFlash(c, t); return; }
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-.8, .2]; M.x = 640; M.look = [-1, .2];
  c.save(); camEcran(c, 1 - z, [540, 405, 1.05]); dessineSalon(c, t, R, M, { tv: 1, ecran: lentille }); c.restore();
  flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}
