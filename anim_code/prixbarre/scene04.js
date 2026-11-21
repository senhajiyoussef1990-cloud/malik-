// SCÈNE 04 — Plans 06-07 (TV). s04a : le manteau du mannequin, étiquette « 100 F » ; des passants le regardent… et repartent.
// s04b : le marchand, seul, une ampoule d’idée au-dessus de la tête, prend sa plume.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 600, 420, 1.05], [B[0], 700, 400, 1.15]]); boutiqueNB(cc, t, { etiq: 0, seul: 1, derriere: (c2) => { for (let k = 0; k < 2; k++) { const u = seg(la, k * .8, k * .8 + 3); dessine(c2, marche(figurant(t, lerp(1100, 560, Math.min(1, u * 2)) + Math.max(0, u * 2 - 1.2) * 900, k ? 4 : 2, { s: .46, y: 800, face: u < .6 ? -1 : 1, look: [u < .6 ? -.6 : .6, 0] }), t, (u > .45 && u < .6) ? 0 : 6)); } } }); }
    else { cam(cc, t, [[B[0], 680, 420, 1.15]]); boutiqueNB(cc, t, { etiq: 0, seul: 1, derriere: (c2) => { const P = MARCHAND(t, 620, { face: 1, look: [.4, -.6], sourire: .8, handR: [80, -560], poseR: 'poing' }); dessine(c2, P); const v = ease(seg(lb, .2, .8)); c2.save(); c2.globalAlpha = v; F(c2, ell(620, 330, 26, 30), GRIS.blanc, 3); F(c2, poly([[608, 360], [632, 360], [630, 376], [610, 376]]), GRIS.moyen, 2); for (let k = 0; k < 6; k++) { ink(c2, 3, GRIS.noir); const a = -Math.PI / 2 + (k - 2.5) * .45; c2.beginPath(); c2.moveTo(620 + Math.cos(a) * 40, 330 + Math.sin(a) * 44); c2.lineTo(620 + Math.cos(a) * 58, 330 + Math.sin(a) * 62); c2.stroke(); } c2.restore(); } }); }
  });
  debutFlash(c, t);
}
