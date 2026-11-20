// SCÈNE 12 — Plans 22-23 (TV). s12a : titre « L'EFFET DE SIMPLE EXPOSITION » : une chanson, un visage, une marque, une idée apparaissent, grossissent à chaque répétition (« vu 1, 2… 9 fois »).
// s12b : sur la place du marché, des haut-parleurs répètent un slogan ; les passants hochent la tête en rythme.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); exposition(cc, t, seg(la, .1, A[1] + 1)); }
    else { cam(cc, t, [[0, 540, 405, 1.0]]); exposition(cc, t, 1); cc.fillStyle = `rgba(214,210,200,${ease(seg(lb, 0, .4)) * .0})`; const k = Math.floor(lb * 2.5) % 4; F(cc, ell(170 + k * 250, 400, 90, 90), 'rgba(255,255,255,.35)', 0); posteRadio(cc, 540, 760, .9, t, 1); }
  });
  debutFlash(c, t);
}
