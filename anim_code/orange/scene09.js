// SCÈNE 09 — Plans 16-17 (TV). s09a : au laboratoire, les fioles bouillonnent ; un grand panneau « VITAMINE C » surgit.
// s09b : dans la cuisine, la mère presse les oranges et sert un verre à chacun, comme un remède.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 380, 1.08]]); laboNB(cc, t, seg(la, A[1] * .45, A[1] * .45 + .5)); }
    else {
      cam(cc, t, [[B[0], 600, 450, 1.15], [DUREE, 620, 440, 1.2]]);
      const Mr = MERE(t, 820, { face: -1, look: [.6, .5], sourire: 1, handR: [150, -560], poseR: 'poing' }), P = PERE(t, 360, { face: 1, look: [.5, .5], sourire: .6 });
      cuisineNB(cc, t, { menu: 'leger', annee: 1925, pere: P, mere: Mr, dessus: (c2) => { const n = Math.floor(seg(lb, .3, B[1]) * 3 + .99); for (let k = 0; k < Math.min(3, n); k++) verreNB(c2, 470 + k * 120, 610, .55, 1); presseAgrumes(c2, 820, 612, .45, t, (lb * .8) % 1); } });
      const m = mainF(Mr, 1); cc.save(); cc.translate(m[0], m[1]); cc.rotate(-.6); carafeNB(cc); cc.restore();
    }
  });
  debutFlash(c, t);
}
function carafeNB(c) { const p = smooth([[-24, 0], [-28, -44], [-16, -72], [16, -72], [28, -44], [24, 0]]); c.save(); c.clip(p); c.fillStyle = GRIS.moyen; c.fillRect(-30, -50, 60, 50); c.restore(); c.fillStyle = 'rgba(255,255,255,.2)'; c.fill(p); ink(c, 3, GRIS.noir); c.stroke(p); }
