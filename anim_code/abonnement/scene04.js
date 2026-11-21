// SCÈNE 04 — Plans 06-07 (TV). s04a : dans un salon des années 1950, un homme ouvre son magazine sur une réclame.
// s04b : la réclame : « LE CLUB DU DISQUE — 12 DISQUES pour 1 cent ! », les disques en éventail, le coupon à découper.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.0], [B[0], 400, 420, 1.15]]); salonClient(cc, t, { pile: 2, factures: 0, derriere: (c2) => { const C2 = CLIENT(t, 420, { face: 1, look: [.3, .6], sourire: .8, handL: [-80, -520], handR: [80, -520], poseL: 'poing', poseR: 'poing' }); dessine(c2, C2); c2.save(); c2.translate(420, 520); F(c2, poly([[-90, -60], [0, -50], [90, -60], [90, 60], [0, 70], [-90, 60]]), GRIS.blanc, 3); c2.font = 'bold 14px Georgia'; c2.textAlign = 'center'; c2.fillStyle = GRIS.noir; c2.fillText('12 DISQUES', 45, -24); disqueNB(c2, 45, 16, .3, 0); c2.restore(); } }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); clubDisques(cc, t, seg(lb, 0, B[1] * .7)); }
  });
  debutFlash(c, t);
}
