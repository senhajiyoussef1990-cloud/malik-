// SCÈNE 09 — Plans 16-17 (TV). Le facteur découvre les articles, désorienté : « Les personnes concernées ne reconnaissent plus leur histoire. »
// Le passant lève la main pour raconter ce qui s'est vraiment passé : « Un témoin veut rétablir la suite. »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const lb = t - B[0];
    cam(cc, t, [[0, 500, 460, 1.25], [B[0], 500, 460, 1.25], [B[0] + .4, 680, 460, 1.25], [DUREE, 680, 460, 1.25]]);
    placeFeteNB(cc, t, { enfants: false, flaque: false, travaux: false, foule: false });
    const Fa = FACTEUR(t, 420, { look: [0, .6], sourcil: 1, sourire: -.5, tilt: .1, handL: [-60, -540], handR: [60, -540], poseL: 'poing', poseR: 'poing' }); dessine(cc, Fa); const a = mainF(Fa, -1), b = mainF(Fa, 1); une(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 20, .3, 'AGRESSION !', 1);
    const P = figurant(t, 720, 2, { s: .48, y: 790, face: -1, chapeau: COIFFE.casquette, look: [.8, 0] }); if (lb >= 0) { P.handR = [60, -940]; P.poseR = 'ouverte'; P.sourcil = .8; } dessine(cc, P);
  });
  debutFlash(c, t);
}
