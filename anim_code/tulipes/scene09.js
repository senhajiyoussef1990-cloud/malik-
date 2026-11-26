// SCÈNE 09 — le renard parle au spectateur : question en commentaire, clin d'œil.
const A = L.s09a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s09a'], t), M = moutonBase(t), la = t - A[0];
  R.x = 430; R.look = [0, 0]; R.sourire = 1; R.handR = [200, -660]; R.poseR = 'pointe'; M.x = 760; M.look = [-.6, -.1]; M.sourire = 1;
  if (la > A[1] + .1 && la < A[1] + .5) R.wink = 1;
  c.save(); cam(c, t, [[0, 470, 420, 1.45], [DUREE, 470, 400, 1.55]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, objet: 1, t }) });
  c.restore();
  const k = ease(seg(la, A[1] * .4, A[1] * .4 + .4)); if (k > 0) { c.setTransform(1, 0, 0, 1, 0, 0); c.save(); c.globalAlpha = k; c.translate(W / 2, 735 + (1 - k) * 30);
    c.font = 'bold 40px Georgia'; c.textAlign = 'center'; const s = 'DIS-LE EN COMMENTAIRE ↓', w = c.measureText(s).width + 50; c.fillStyle = '#ffd23a'; c.fillRect(-w / 2, -48, w, 66); c.fillStyle = '#141210'; c.fillText(s, 0, 0); c.restore(); }
}
