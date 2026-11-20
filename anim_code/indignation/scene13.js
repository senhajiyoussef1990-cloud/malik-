// SCÈNE 13 — Plan 24 (TV). Les habitants regardent enfin les trois photographies côte à côte : « Voir la suite calme la discussion. »
const A = L.s13a, DUREE = A[0] + A[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 420, 1.05]]); placeFeteNB(cc, t, { enfants: false, flaque: false, travaux: false, foule: false });
    F(cc, poly([[260, 240], [820, 240], [820, 420], [260, 420]]), GRIS.fonce, 4); [0, 1, 2].forEach((m) => photoMoment(cc, 350 + m * 190, 330, 160, m));
    for (let k = 0; k < 7; k++) dessine(cc, figurant(t, 120 + k * 140, k + 1, { s: .44, y: 800, face: k < 4 ? 1 : -1, look: [k < 4 ? .5 : -.5, -.6], sourire: .9, chapeau: [COIFFE.casquette, COIFFE.foulard, COIFFE.kepi][k % 3] })); });
  debutFlash(c, t);
}
