// SCÈNE 12 — Plans 22-23 (TV). s12a : un petit chariot cherche son chemin dans un labyrinthe de rayons jusqu’au LAIT.
// s12b : sur le plan du magasin, un chemin direct, tracé à la règle, va de l’entrée au lait.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) labyrinthe(cc, t, seg(la, 0, A[1])); else { planMagasin(cc, t, 1); const v = ease(seg(lb, .3, 1.5)); ink(cc, 8, GRIS.noir); cc.beginPath(); cc.moveTo(120, 740); cc.lineTo(lerp(120, 1010, v), lerp(740, 180, v)); cc.stroke(); cc.font = 'italic bold 34px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; if (v > .9) cc.fillText('mon chemin !', 640, 700); } });
  debutFlash(c, t);
}
