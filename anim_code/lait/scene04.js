// SCÈNE 04 — Plans 06-07 (TV). s04a : une cliente tend sa liste ; derrière le comptoir, l’épicier grimpe à l’échelle chercher les produits.
// s04b : un commerçant en canotier, songeur devant le comptoir, puis l’idée : il ouvre grand les bras.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.0], [B[0], 600, 420, 1.05]]); const u = seg(la, .5, 3); comptoirNB(cc, t, { derriere: (c2) => dessine(c2, figurant(t, lerp(700, 960, u), 0, { s: .46, y: lerp(560, 400, u), face: 1, look: [.3, -.8], tablier: 'blanc', handR: [60, -700], poseR: 'poing' })) }); const C2 = CLIENTE(t, 380, { y: 880, s: .55, face: 1, look: [.6, -.2], handR: [140, -600], poseR: 'ouverte' }); dessine(cc, C2); const h = mainF(C2, 1); F(cc, poly([[h[0] - 4, h[1] - 60], [h[0] + 50, h[1] - 64], [h[0] + 54, h[1] + 10], [h[0], h[1] + 14]]), GRIS.blanc, 2); for (let k = 0; k < 4; k++) { ink(cc, 1.5, 'rgba(0,0,0,.4)'); cc.beginPath(); cc.moveTo(h[0] + 8, h[1] - 44 + k * 14); cc.lineTo(h[0] + 44, h[1] - 46 + k * 14); cc.stroke(); } }
    else { cam(cc, t, [[B[0], 540, 420, 1.05]]); comptoirNB(cc, t); const ok = lb > B[1] * .5; const P = INVENTEUR(t, 540, { y: 880, s: .56, face: 1, look: ok ? [0, -.3] : [.4, -.7], sourire: ok ? 1.2 : 0, handR: ok ? [190, -640] : [60, -720], poseR: ok ? 'ouverte' : 'pointe', handL: ok ? [-190, -640] : [-96, -400], poseL: ok ? 'ouverte' : 'poing' }); dessine(cc, P); }
  });
  debutFlash(c, t);
}
