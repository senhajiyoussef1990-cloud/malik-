// SCÈNE 17 — Plan 30. Le poste se rallume sur le logo ; la voix du téléviseur : « Arrête de suivre le troupeau. Suis le renard… et pense par toi-même ! »
const A = L.s17a, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : A[0] + A[1] + 2.0);
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
  const R = renardBase(t), M = moutonBase(t); R.x = 400; R.look = [-1, .2]; M.x = 720; M.look = [-1, .2]; M.chapeau = CHAP_TETE(-.12); M.sourire = 1;
  const on = ease(seg(t, .1, .6)), z = ease(seg(t, .6, A[0] + .2));
  c.save(); camEcran(c, z * .8, [540, 405, 1.12]);
  dessineSalon(c, t, R, M, { tv: on, ecran: logo });
  c.restore();
  if (t > DUREE - .8) { c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(0,0,0,${ease(seg(t, DUREE - .8, DUREE))})`; c.fillRect(0, 0, W, H); }
}
