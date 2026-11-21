// SCÈNE 06 — le poste se rallume sur le logo : « Abonne-toi… » puis la phrase finale et le clin d’œil du renard
const A = L.s06b, DUREE = A[0] + A[1] + 1.6;
function logo(cc, t) {
  cc.fillStyle = GRIS.noir; cc.fillRect(0, 0, W, H);
  for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12 + t * .15; cc.fillStyle = k % 2 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,0)'; cc.beginPath(); cc.moveTo(540, 405); cc.arc(540, 405, 900, a, a + Math.PI / 12); cc.fill(); }   // rayons
  F(cc, ell(540, 405, 380, 290), GRIS.blanc, 10); F(cc, ell(540, 405, 352, 262), GRIS.noir, 4);
  cc.save(); cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.font = 'bold 74px Georgia'; cc.fillText('NE SUIS PAS', 540, 384); cc.fillText('LES MOUTONS', 540, 470);
  cc.font = 'italic 30px Georgia'; cc.fillText('pense par toi-même', 540, 560); cc.restore();
  for (const sd of [-1, 1]) etoile(cc, 540 + sd * 300, 300, 22);
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-1, .2]; M.x = 720; M.look = [-1, .2]; M.sourire = 1; 
  const on = ease(seg(t, .1, .6)), z = ease(seg(t, .5, 2.0));
  c.save(); camEcran(c, z, [540, 405, 1.12]);
  dessineSalon(c, t, R, M, { tv: on, ecran: logo });
  c.restore();
  // la tête du renard surgit dans le coin, regarde la caméra… et fait un clin d'œil
  const sl = ease(seg(t, 2.0, 2.6)), tq = step(t);
  if (sl > 0) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    const T = renardBase(t); T.x = 945; T.y = 1440 + (1 - sl) * 520; T.s = .95; T.look = [-.4, 0]; T.lid = .5; T.sourire = 1; T.sourcil = .5; T.tilt = -.12 + wob(tq, .5, .02); T.bob = 0;
    T.handL = [-104, -440]; T.handR = [104, -440];
    if (t > 2.8) { T.look = [0, 0]; T.tilt = -.06; }
    if (t > DUREE - 1.3 && t < DUREE - .8) { T.wink = 1; T.sourcil = 1; T.tilt = -.02; }
    c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip(); drawRenard(c, T); c.restore();
  }
  if (t > DUREE - .5) { c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(0,0,0,${ease(seg(t, DUREE - .5, DUREE))})`; c.fillRect(0, 0, W, H); }
}
