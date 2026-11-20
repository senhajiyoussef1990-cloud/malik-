// SCÈNE 11 — Plan 20 (TV). « Le tableau complet est plus nuancé. » Un montage réunit les deux témoignages, le plan et la vue large.
const A = L.s11a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const u = seg(t, .1, DUREE - .4), ap = (k) => ease(clamp(u * 4 - k));
    cam(cc, t, [[0, 540, 405, 1.0]]);
    cc.fillStyle = GRIS.moyen; cc.fillRect(0, 0, W, H); F(cc, poly([[40, 30], [1040, 30], [1040, 780], [40, 780]]), '#d8d4ca', 6);   // le panneau de liège
    cc.save(); cc.globalAlpha = ap(0); photo(cc, 540, 250, 560, 'large', 0); cc.restore();
    cc.save(); cc.globalAlpha = ap(1); planPlace(cc, 200, 600, .5, 1); cc.restore();
    for (const [k, x, txt] of [[2, 540, '« J’aime la fontaine, mais le sol glisse. »'], [3, 870, '« Contents d’avoir ce lieu. »']]) { if (ap(k) <= 0) continue; cc.save(); cc.globalAlpha = ap(k); cc.translate(x, 620); F(cc, poly([[-150, -80], [150, -80], [150, 80], [-150, 80]]), GRIS.blanc, 3); cc.font = 'italic 17px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; const m = txt.split(', '); m.forEach((l, q) => cc.fillText(l + (q < m.length - 1 ? ',' : ''), 0, -10 + q * 26)); cc.restore(); }
    for (const [x, y] of [[540, 70], [200, 470], [540, 540], [870, 540]]) F(cc, ell(x, y, 8, 8), GRIS.noir, 2);   // punaises
  });
  debutFlash(c, t);
}
