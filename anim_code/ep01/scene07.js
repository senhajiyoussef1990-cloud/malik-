// SCÈNE 07 — trois chapeaux : un trop luxueux, un trop simple, un « raisonnable ». Narrateur s07a.
function chapeauTV(c, x, y, s, type, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, ell(0, 0, 22, 6), GRIS.fonce, 2.5); F(c, poly([[-3, 0], [3, 0], [3, -30], [-3, -30]]), GRIS.moyen, 2);
  if (type === 'luxe') { F(c, ell(0, -32, 64, 12), GRIS.noir, 4); const p = poly([[-36, -34], [36, -34], [32, -130], [-32, -130]]); F(c, p, GRIS.noir, 4); F(c, ell(0, -130, 32, 8), GRIS.fonce, 3);
    F(c, poly([[-36, -50], [36, -50], [36, -38], [-36, -38]]), GRIS.blanc, 2); for (let k = 0; k < 4; k++) etoile(c, -50 + k * 34, -150 - 10 * Math.sin(t * 4 + k), 9);
    c.save(); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 4; c.strokeText('999 F', 0, 36); c.fillText('999 F', 0, 36); c.restore(); }
  else if (type === 'pauvre') { F(c, ell(0, -32, 40, 7), GRIS.clair, 3); F(c, smooth([[-24, -34], [-20, -58], [20, -58], [24, -34]]), GRIS.clair, 3); ink(c, 2); c.beginPath(); c.moveTo(-10, -50); c.lineTo(6, -40); c.stroke();
    c.save(); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 4; c.strokeText('5 F', 0, 36); c.fillText('5 F', 0, 36); c.restore(); }
  else { F(c, ell(0, -32, 52, 10), GRIS.moyen, 4); const p = smooth([[-30, -34], [-26, -76], [0, -86], [26, -76], [30, -34]]); F(c, p, GRIS.moyen, 4); ombre(c, p, -30, 0, 30, 0, .3); F(c, poly([[-30, -46], [30, -46], [30, -38], [-30, -38]]), GRIS.noir, 2);
    c.save(); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.strokeStyle = '#000'; c.lineWidth = 4; c.strokeText('49 F', 0, 36); c.fillText('49 F', 0, 36); c.restore(); }
  c.restore();
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const l = local('s07a', t), D = L.s07a[1], foc = l < D * .3 ? 0 : l < D * .55 ? 2 : 1;      // le narrateur cite : trop cher, trop pauvre, puis le milieu
    const X = [380, 700, 540];
    cam(cc, t, [[0, 540, 405, 1.0], [L.s07a[0] + D * .1, X[0], 430, 1.3], [L.s07a[0] + D * .32, X[1], 430, 1.3], [L.s07a[0] + D * .58, X[2], 430, 1.34], [DUREE, 560, 410, 1.12]]);
    magasinNB(cc, t); comptoirNB(cc, 260, 840, 560);
    if (foc === 1 && l > D * .58) projecteur(cc, X[2], 560, .7);
    chapeauTV(cc, X[0], 560, 1, 'luxe', t); chapeauTV(cc, X[2], 560, 1, 'milieu', t); chapeauTV(cc, X[1], 560, 1, 'pauvre', t);
    const C = clientBase(t, 950); C.look = [-1, .3];
    if (l > D * .6) { const k = ease(seg(l, D * .6, D * .6 + .5)); C.handR = [lerp(100, 300, k), lerp(-380, -500, k)]; C.poseR = 'ouverte'; C.lean = .08 * k; C.sourcil = .6; C.sourire = 1.2; }
    dessine(cc, C, drawClient);
  });
  debutFlash(c, t);
}
