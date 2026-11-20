// SCÈNE 04 — Plans 06-07 (TV). s04a : dans la biscuiterie, les étiquettes du beurre et de la farine changent : 1 F → 1,40 F ; le biscuitier gratte sa toque.
// s04b : le biscuitier, inquiet, devant son tapis de biscuits : « Si j'augmente le prix, mes clients vont tout de suite le voir ! »
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 820, 380, 1.4], [A[0] + A[1] * .6, 820, 380, 1.4], [B[0], 560, 430, 1.15], [DUREE, 540, 420, 1.22]]);
    const Bs = voix(BISCUITIER(t, 560, { face: 1, look: [.8, -.3], froncer: .6, sourcil: .4 }), ['s04b'], t);
    if (la >= 0 && lb < 0) { Bs.handL = [-30, -790]; Bs.poseL = 'pointe'; Bs.tilt += Math.sin(t * 9) * .03; }
    if (lb >= 0) { Bs.look = [0, 0]; Bs.handL = [-170, -620]; Bs.handR = [170, -620]; Bs.poseL = Bs.poseR = 'ouverte'; Bs.sourcil = 1; }
    const hausse = la > A[1] * .3;
    biscuiterieNB(cc, t, { prix: hausse ? ['1,40 F', '1,30 F'] : ['1 F', '1 F'], derriere: (c2) => dessine(c2, Bs) });
    if (la > A[1] * .3 && la < A[1] * .6) for (let k = 0; k < 2; k++) { ink(cc, 5, GRIS.noir); cc.beginPath(); cc.moveTo(885 + k * 115, 330); cc.lineTo(885 + k * 115, 300); cc.stroke(); F(cc, poly([[875 + k * 115, 304], [895 + k * 115, 304], [885 + k * 115, 286]]), GRIS.noir, 0); }
  });
  debutFlash(c, t);
}
