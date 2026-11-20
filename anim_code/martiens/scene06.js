// SCÈNE 06 — Plans 10-11 (TV). s06a : dans le salon de la famille, la radio parle ; dans une bulle, la famille imagine le tripode martien au-dessus d'une ferme et d'un château d'eau.
// s06b : le speaker hurle : « Les créatures avancent vers New York ! Fuyez ! » — le père se lève d'un bond, la mère serre son châle.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 405, 1.0], [B[0], 520, 420, 1.1], [DUREE, 520, 430, 1.15]]);
    const P = PERE(t, 260, { face: 1, look: [.8, .1], froncer: .6 }), Mr = MERE(t, 430, { face: 1, look: [.8, 0], froncer: .5 });
    if (lb >= 0) { P.y = 770; P.look = [.4, -.4]; P.sourcil = 1; P.handL = [-80, -700]; P.handR = [80, -700]; P.poseL = P.poseR = 'ouverte'; Mr.sourcil = 1; Mr.handL = [-30, -600]; Mr.handR = [40, -600]; Mr.poseL = Mr.poseR = 'poing'; Mr.tilt -= .06; }
    salon38NB(cc, t, { derriere: (c2) => { dessine(c2, P); dessine(c2, Mr); } });
    bulleMartien(cc, 560, 220, .9, seg(la, .3, 1.1), t);
    if (lb >= 0) { cc.save(); cc.translate(790, 380); for (let k = 0; k < 3; k++) { const u = (lb * 2 + k / 3) % 1; ink(cc, 6, `rgba(0,0,0,${.7 * (1 - u)})`); cc.beginPath(); cc.arc(0, 0, 40 + u * 180, -2.4, -.7); cc.stroke(); } cc.restore(); }
  });
  debutFlash(c, t);
}
