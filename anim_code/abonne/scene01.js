// ÉCRAN DE FIN — appel à l'abonnement (6 s). Dans le salon, le poste affiche le logo ; un gros bouton « S'ABONNER » surgit,
// le mouton appuie dessus : il devient « ABONNÉ ✓ », la cloche sonne, le renard fait un clin d'œil. « Abonne-toi pour ne plus suivre le troupeau ! »
const DUREE = 6.0;
function logoTV(cc, t) { cc.fillStyle = GRIS.noir; cc.fillRect(0, 0, W, H); F(cc, ell(540, 405, 380, 290), GRIS.blanc, 10); F(cc, ell(540, 405, 352, 262), GRIS.noir, 4); cc.save(); cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.font = 'bold 74px Georgia'; cc.fillText('NE SUIS PAS', 540, 384); cc.fillText('LES MOUTONS', 540, 470); cc.restore(); }
function bouton(c, x, y, s, abonne, press) { c.save(); c.translate(x, y); c.scale(s * (press ? .93 : 1), s * (press ? .93 : 1));
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.roundRect(-250, -58, 500, 128, 64); c.fill();
  c.fillStyle = abonne ? '#d8d8d8' : '#e0201c'; c.beginPath(); c.roundRect(-250, -70, 500, 128, 64); c.fill(); c.lineWidth = 5; c.strokeStyle = abonne ? '#8a8a8a' : '#7a0a08'; c.stroke();
  c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.roundRect(-226, -60, 452, 40, 20); c.fill();
  c.textAlign = 'center'; c.font = 'bold 64px Georgia'; c.fillStyle = abonne ? '#3a3a3a' : '#ffffff'; c.fillText(abonne ? 'ABONNÉ ✓' : 'S’ABONNER', 0, 16); c.restore(); }
function cloche(c, x, y, s, a) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); F(c, smooth([[-40, 30], [-34, -20], [-20, -46], [0, -54], [20, -46], [34, -20], [40, 30], [52, 44], [-52, 44]]), '#f2c230', 4); F(c, ell(0, 56, 14, 12), '#c89010', 3); F(c, ell(0, -58, 9, 8), '#c89010', 3); c.restore();
  if (Math.abs(a) > .05) for (const d of [-1, 1]) { ink(c, 5, '#f2c230'); c.beginPath(); c.arc(x, y, 80 * s, d > 0 ? -.6 : Math.PI - .4, d > 0 ? .4 : Math.PI + .6); c.stroke(); } }
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t), fi = ease(seg(t, 0, .4));
  R.x = 270; M.x = 820; R.look = [.6, .2]; M.look = [-.6, .3]; M.sourire = 1; R.sourire = .9;
  const clic = 1.9, ab = t > clic + .1;
  // le mouton tend la patte vers le bouton, appuie
  const k = ease(seg(t, 1.1, clic)); M.handR = [lerp(-80, -330, k), lerp(-420, -600, k)]; M.poseR = 'pointe'; if (ab) { M.handR = [-300, -600]; M.rire = t < clic + 1.2 ? 1 : 0; }
  if (t > 3.6) { R.look = [0, 0]; R.handR = [150, -640]; R.poseR = 'pointe'; }
  if (t > 4.6 && t < 5.1) R.wink = 1;
  c.save(); cam(c, t, [[0, 540, 430, 1.05], [DUREE, 540, 420, 1.1]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: logoTV });
  c.restore();
  c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = 'rgba(10,10,20,.35)'; c.fillRect(0, 0, W, H);
  // le texte d'appel
  const tx = ease(seg(t, .2, .8)); c.save(); c.globalAlpha = tx; c.textAlign = 'center'; c.font = 'bold 52px Georgia'; c.lineWidth = 10; c.strokeStyle = '#1a1010'; c.fillStyle = '#ffe14d';
  c.strokeText('Abonne-toi pour ne plus', 540, 110 - (1 - tx) * 30); c.fillText('Abonne-toi pour ne plus', 540, 110 - (1 - tx) * 30); c.strokeText('suivre le troupeau !', 540, 172 - (1 - tx) * 30); c.fillText('suivre le troupeau !', 540, 172 - (1 - tx) * 30); c.restore();
  // le bouton surgit, rebondit, est pressé
  const bs = t < .5 ? 0 : Math.min(1.08, ease(seg(t, .5, .9)) * 1.08) - Math.max(0, seg(t, .9, 1.05)) * .08;
  if (bs > 0) bouton(c, 540, 420, bs, ab, t > clic - .05 && t < clic + .15);
  // la cloche sonne
  if (t > clic + .2) { const a = Math.sin((t - clic) * 22) * .45 * Math.max(0, 1 - (t - clic - .2) / 1.4); cloche(c, 540, 268, .75 * ease(seg(t, clic + .2, clic + .5)), a); }
  // j'aime et partage
  const pj = ease(seg(t, 2.8, 3.3)); if (pj > 0) { c.save(); c.globalAlpha = pj; c.textAlign = 'center'; c.font = 'bold 40px Georgia'; c.lineWidth = 8; c.strokeStyle = '#1a1010'; c.fillStyle = '#ffffff'; c.strokeText('👍 J’aime   ·   ↗ Partage', 540, 600); c.fillText('👍 J’aime   ·   ↗ Partage', 540, 600); c.font = 'italic bold 32px Georgia'; c.fillStyle = '#ffe14d'; c.strokeText('à un mouton qui doit voir ça', 540, 655); c.fillText('à un mouton qui doit voir ça', 540, 655); c.restore(); }
  if (fi < 1) { c.fillStyle = `rgba(0,0,0,${1 - fi})`; c.fillRect(0, 0, W, H); }
}
