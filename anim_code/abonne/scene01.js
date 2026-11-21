// ÉCRAN DE FIN — appel à l'abonnement (6 s). Dans le salon, le poste affiche le logo ; un gros bouton « S'ABONNER » surgit,
// le mouton appuie dessus : il devient « ABONNÉ ✓ », la cloche sonne, le renard fait un clin d'œil. « Abonne-toi pour ne plus suivre les moutons ! »
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
  // fond noir et rayons, comme l'écran final du logo
  c.fillStyle = GRIS.noir; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12 + t * .15; c.fillStyle = k % 2 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,0)'; c.beginPath(); c.moveTo(540, 405); c.arc(540, 405, 900, a, a + Math.PI / 12); c.fill(); }
  // le logo remonte et rétrécit
  const u = ease(seg(t, .2, .9)), ly = lerp(405, 190, u), ls = lerp(1, .58, u);
  c.save(); c.translate(540, ly); c.scale(ls, ls); F(c, ell(0, 0, 380, 290), GRIS.blanc, 10); F(c, ell(0, 0, 352, 262), GRIS.noir, 4); c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.font = 'bold 74px Georgia'; c.fillText('NE SUIS PAS', 0, -21); c.fillText('LES MOUTONS', 0, 65); c.font = 'italic 30px Georgia'; c.fillText('pense par toi-même', 0, 155); for (const sd of [-1, 1]) etoile(c, sd * 300, -105, 22); c.restore();
  // le texte d'appel
  const tx = ease(seg(t, .8, 1.3)); c.save(); c.globalAlpha = tx; c.textAlign = 'center'; c.font = 'bold 46px Georgia'; c.lineWidth = 8; c.strokeStyle = '#000'; c.fillStyle = '#ffe14d'; c.strokeText('Abonne-toi pour ne plus suivre les moutons !', 540, 420); c.fillText('Abonne-toi pour ne plus suivre les moutons !', 540, 420); c.restore();
  // le bouton surgit, une patte de renard vient appuyer dessus
  const clic = 2.2, ab = t > clic + .05;
  const bs = t < 1.0 ? 0 : Math.min(1.08, ease(seg(t, 1.0, 1.4)) * 1.08) - Math.max(0, seg(t, 1.4, 1.55)) * .08;
  if (bs > 0) bouton(c, 450, 545, bs * .95, ab, t > clic - .05 && t < clic + .15);
  // la cloche sonne à côté du bouton
  const cs = ease(seg(t, 1.2, 1.6)); if (cs > 0) { const a = t > clic + .1 ? Math.sin((t - clic) * 22) * .45 * Math.max(0, 1 - (t - clic - .1) / 1.4) : 0; cloche(c, 780, 545, .8 * cs, a); }
  // le curseur-patte
  const k = ease(seg(t, 1.5, clic)), k2 = ease(seg(t, clic + .3, clic + .8)); if (k > 0 && k2 < 1) { const px = lerp(1150, 560, k) + k2 * 600, py = lerp(900, 575, k) + k2 * 300; c.save(); c.translate(px, py); F(c, poly([[0, 0], [0, 70], [18, 54], [32, 84], [44, 78], [30, 48], [54, 46]]), GRIS.blanc, 4); c.restore(); }
  // j'aime, partage
  const pj = ease(seg(t, 3.0, 3.5)); if (pj > 0) { c.save(); c.globalAlpha = pj; c.textAlign = 'center'; c.font = 'bold 40px Georgia'; c.lineWidth = 8; c.strokeStyle = '#000'; c.fillStyle = '#ffffff'; c.strokeText('👍 J’aime   ·   ↗ Partage', 540, 700); c.fillText('👍 J’aime   ·   ↗ Partage', 540, 700); c.font = 'italic bold 32px Georgia'; c.fillStyle = '#ffe14d'; c.strokeText('à un mouton qui doit voir ça', 540, 752); c.fillText('à un mouton qui doit voir ça', 540, 752); c.restore(); }
  // la tête du renard dans le coin, comme sur l'écran du logo ; clin d'œil
  const T = renardBase(t); T.x = 945; T.y = 1440; T.s = .95; T.look = [-.5, 0]; T.lid = .5; T.sourire = 1; T.sourcil = .5; T.tilt = -.12 + wob(step(t), .5, .02); T.bob = 0; T.handL = [-104, -440]; T.handR = [104, -440];
  if (t > 3.8) { T.look = [0, 0]; T.tilt = -.06; } if (t > 4.6 && t < 5.1) { T.wink = 1; T.sourcil = 1; }
  c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip(); drawRenard(c, T); c.restore();
}
