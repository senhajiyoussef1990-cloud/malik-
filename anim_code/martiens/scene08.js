// SCÈNE 08 — Plans 14-15 (TV). s08a : au standard de la police, quelques voyants s'allument ; deux standardistes au casque décrochent, étonnées.
// s08b : le sondage d'audience : la pièce martienne — quelques pour cent ; une autre station (le ventriloque et sa marionnette) — la grande majorité.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.08], [B[0], 540, 430, 1.14]]); const S = [STANDARDISTE(t, 360, 0, { look: [.2, -.6], sourcil: .8, handR: [60, -700], poseR: 'poing' }), STANDARDISTE(t, 720, 1, { face: -1, look: [-.2, -.6], sourcil: .6, handR: [60, -700], poseR: 'poing' })]; standardNB(cc, t, { derriere: (c2) => S.forEach(p => dessine(c2, p)) }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); audience(cc, t, seg(lb, .2, B[1])); }
  });
  debutFlash(c, t);
}
