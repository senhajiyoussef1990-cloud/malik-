// SCÈNE 01 — HOOK : l'image choc de la fable + le chiffre en grand, dès la première seconde.
const A = L.h1, DUREE = A[0] + A[1] + .35;
const X = ((cc, t, u) => crieurCloche(cc, t, null, { foule: 1 })), HT = ["50 COUPS DE CLOCHE PAR JOUR", "… pour des croissants"];
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
