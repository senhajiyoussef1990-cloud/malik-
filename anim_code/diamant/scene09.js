// SCÈNE 09 — Plans 16-17 (TV). s09a : la rédactrice arrache la feuille et la brandit : « Un diamant est éternel ! » — le slogan éclate en grand, rayons et diamant.
// s09b : au comptoir de rachat, le bijou se revend trois fois moins cher : « éternel »… on le garde.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      if (la < A[1] * .45) { cam(cc, t, [[0, 520, 400, 1.2]]); const Rd = voix(figurant(t, 250, 1, { s: .5, y: 860, face: 1, look: [0, -.2], sourire: 1.2, handL: [-40, -760], handR: [60, -760], poseL: 'poing', poseR: 'poing', chapeau: (c2, hy) => { for (let k = -3; k <= 3; k++) F(c2, ell(k * 16, hy - 66 + Math.abs(k) * 7, 15, 13), GRIS.noir, 0); } }), ['s09a'], t); redactionNB(cc, t, { texte: 1, derriere: (c2) => dessine(c2, Rd) }); }
      else { cam(cc, t, [[0, 540, 405, 1.0]]); sloganGeant(cc, t, seg(la, A[1] * .45, A[1] * .45 + .6)); }
    } else { cam(cc, t, [[B[0], 540, 420, 1.1], [DUREE, 540, 440, 1.16]]); rachatNB(cc, t, seg(lb, .6, B[1] * .8)); }
  });
  debutFlash(c, t);
}
