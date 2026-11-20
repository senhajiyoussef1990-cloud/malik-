// SCÈNE 06 — Plans 10-11. Un rédacteur observe la photo et écrit un titre exagéré : « Le titre suggère une agression. »
// Le mouton lit la manchette ; son visage passe de la curiosité à l'indignation : « Vu comme ça, je serais furieux aussi. »
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < -.1) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 500, 420, 1.15]]); redaction(cc, t); une(cc, 560, 420, .9, 'AGRESSION SUR LA PLACE !'.slice(0, Math.ceil(24 * seg(la, .2, A[1]))), 1, { taille: 24 }); dessine(cc, figurant(t, 220, 0, { s: .5, y: 800, face: 1, look: [.8, .3], sourire: 1, chapeau: COIFFE.visiere, handR: [160, -600], poseR: 'pointe' })); }); debutFlash(c, t); return; }
  const [R, M] = herosTV(t, 160, 860); voix(M, ['s06b'], t); const k = ease(seg(lb, 0, B[1])); M.froncer = k; M.sourire = lerp(.4, -.8, k); M.look = [-.5, .2]; M.oreille = -.2 * k; R.look = [.8, .2];
  nbEtCouleur(c, t, [[0, 520, 420, 1.1]], (cc) => { redaction(cc, t); une(cc, 520, 420, .9, 'AGRESSION SUR LA PLACE !', 1, { taille: 24 }); }, (cc) => heros(cc, R, M));
}
