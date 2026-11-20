// SCÈNE 10 — Plans 18-19 (TV). Un instant de silence ; les regards se tournent vers la factrice : « Il suffit parfois de changer de source. »
// Elle explique : « Le pont était fermé hier. Il est rouvert. »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const lb = t - B[0];
    cam(cc, t, [[0, 560, 460, 1.1], [DUREE, 640, 460, 1.3]]);
    placeNB(cc, t, {});
    for (let k = 0; k < 6; k++) dessine(cc, figurant(t, 100 + k * 100, k + 1, { s: .44, y: 800, face: 1, look: [.9, 0], sourcil: .6, chapeau: [COIFFE.casquette, COIFFE.foulard, COIFFE.toque][k % 3] }));
    const Fa = FACTRICE(t, 820, { look: [.8, 0] }); if (lb >= 0) { voix(Fa, ['s10b'], t); Fa.handR = [200, -640]; Fa.poseR = 'ouverte'; Fa.sourire = .7; } dessine(cc, Fa);
  });
  debutFlash(c, t);
}
