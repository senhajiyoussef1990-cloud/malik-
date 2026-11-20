// SCÈNE 05 — Plans 08-09 (TV). Le passant recule… puis aide le facteur à ramasser les fleurs : « La scène se termine pourtant par de l'entraide. »
// Mais le photographe n'a capturé que la seconde du faux pas : « Mais une seule image est publiée. »
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const lb = t - B[0];
    if (lb < 0) { cam(cc, t, [[0, 560, 520, 1.4]]); momentPlace(cc, t, 2); }
    else { cam(cc, t, [[0, 540, 405, 1.0]]); momentPlace(cc, t, 1, 1); const P = PHOTOGRAPHE(t, 170, 0, { y: 800, face: 1 }); dessine(cc, P); appareil(cc, 220, 570, .9, -.05); viseur(cc, [380, 430, 400, 300], ease(seg(lb, .2, .7))); if (lb > .8 && lb < 1) flash(cc, .7); }
  });
  debutFlash(c, t);
}
