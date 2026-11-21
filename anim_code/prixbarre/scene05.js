// SCÈNE 05 — Plans 08-09 (TV). s05a : le marchand écrit « 200 F » en grand, le barre d’un trait, et dessous « 100 F » : « Deux cents francs ! Et juste en dessous, je le barre. Cent francs, une affaire ! »
// s05b : l’étiquette en gros plan : le « 200 F » barré n’a peut-être jamais existé… il sert de point de comparaison.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 680, 420, 1.15], [B[0], 760, 400, 1.25]]); boutiqueNB(cc, t, { etiq: seg(la, .2, A[1] * .85), derriere: (c2) => dessine(c2, voix(MARCHAND(t, 620, { face: 1, look: [.7, -.1], sourire: 1.1, handR: [170, -600], poseR: 'pointe' }), ['s05a'], t)) }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); etiquetteBarree(cc, 540, 360, 3, 1); const v = ease(seg(lb, B[1] * .3, B[1] * .3 + .6)); cc.save(); cc.globalAlpha = v; cc.font = 'italic bold 30px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('jamais pratiqué ?', 300, 140); ink(cc, 4, GRIS.noir); cc.beginPath(); cc.moveTo(330, 160); cc.lineTo(460, 250); cc.stroke(); cc.fillText('un point de comparaison', 540, 690); cc.restore(); }
  });
  debutFlash(c, t);
}
