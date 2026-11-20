// SCÈNE 09 — Plans 16-17 (TV). s09a : au café, le juke-box s'illumine, les clients tapent du pied ; au disquaire, la pile « LE TUBE » fond, la caisse sonne.
// s09b : une auditrice, un sundae à la main près du juke-box, s'enthousiasme : « Je ne l'aimais pas, mais on l'entend partout. Elle est géniale ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 420, 1.08], [B[0], 700, 430, 1.25], [DUREE, 720, 420, 1.3]]);
    const Au = voix(AUDITRICE(t, 700, { face: 1, look: [.4, -.1], sourire: 1.2 }), ['s09b'], t);
    if (lb >= 0) { Au.handL = [-160, -640]; Au.poseL = 'ouverte'; Au.tilt += Math.sin(t * 6) * .06; }
    const clients = [0, 1, 2].map(k => figurant(t, 200 + k * 150, [2, 4, 0][k], { s: .44, y: 700, face: 1, look: [.8, 0], sourire: 1 }));
    clients.forEach((p, k) => { p.bob += Math.abs(Math.sin(t * 6 + k)) * 6; p.tilt += Math.sin(t * 6 + k) * .05; });
    cafeNB(cc, t, { derriere: (c2) => clients.forEach(p => dessine(c2, p)), devant: (c2) => dessine(c2, Au) });
    const h = mainF(Au, 1); F(cc, smooth([[h[0] - 14, h[1] - 10], [h[0] + 14, h[1] - 10], [h[0] + 6, h[1] + 20], [h[0] - 6, h[1] + 20]]), 'rgba(255,255,255,.6)', 2); F(cc, ell(h[0], h[1] - 18, 16, 12), GRIS.blanc, 2); F(cc, ell(h[0], h[1] - 30, 5, 5), GRIS.fonce, 0);
  });
  debutFlash(c, t);
}
