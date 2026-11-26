// SCÈNE 01 — HOOK : l'image choc de la fable + le chiffre en grand, dès la première seconde.
const A = L.h1, DUREE = A[0] + A[1] + .35;
const X = ((cc, t, u) => { if (!_ma) _ma = fondMarche(); cc.drawImage(_ma, 0, 0); bulbe(cc, 300, 640, 2.2); cc.font = 'bold 110px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('=', 520, 560); cc.save(); cc.translate(760, 690); cc.scale(1.4, 1.4); F(cc, poly([[-110, 0], [110, 0], [110, -160], [-110, -160]]), GRIS.blanc, 4); F(cc, poly([[-135, -160], [135, -160], [0, -260]]), GRIS.fonce, 4); F(cc, poly([[-24, 0], [24, 0], [24, -86], [-24, -86]]), GRIS.fonce, 3); for (const x of [-70, 70]) F(cc, poly([[x - 22, -120], [x + 22, -120], [x + 22, -80], [x - 22, -80]]), '#e8e0c8', 2); cc.restore(); }), HT = ["1 BULBE = 1 MAISON", "Pays-Bas, 1637"];
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.12], [DUREE, 540, 405, 1.0]]); X(cc, t, seg(t, 0, DUREE)); });
  c.setTransform(1, 0, 0, 1, 0, 0);
  const k = ease(seg(t, .05, .35)), s = .6 + .4 * k + .03 * Math.sin(t * 7);
  c.save(); c.translate(W / 2, 175); c.scale(s, s); c.globalAlpha = k; c.textAlign = 'center';
  HT.forEach((l, i) => { let fs = i ? 52 : 78; c.font = `bold ${fs}px Georgia`; while (c.measureText(l).width > 960 && fs > 30) { fs -= 2; c.font = `bold ${fs}px Georgia`; } const w = c.measureText(l).width + 50, y = i * 92;
    c.fillStyle = i ? 'rgba(20,18,16,.85)' : '#ffd23a'; c.fillRect(-w / 2, y - (i ? 52 : 74), w, i ? 70 : 96);
    c.fillStyle = i ? '#fff' : '#141210'; c.fillText(l, 0, y); });
  c.restore();
}
