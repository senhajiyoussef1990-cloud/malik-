// SCÈNE 12 — Plans 22-23. Le mouton constate que la machine attend sans rien réclamer : « Elle peut attendre. Moi, j'ai autre chose à faire. »
// Le joueur retrouve ses amis devant le manège et rit avec eux : « L'attention retrouve d'autres plaisirs. »
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  if (lb < -.1) { const [R, M] = herosTV(t, 300, 560); voix(M, ['s12a'], t); M.face = 1; M.look = [.9, -.1]; M.sourire = .9; M.handR = [104, -366]; R.look = [.9, 0]; R.sourire = .8;
    nbEtCouleur(c, t, [[0, 600, 460, 1.15]], (cc) => { feteNB(cc, t, {}); machine(cc, 840, 760, .9, t, { clignote: true }); }, (cc) => heros(cc, R, M)); debutFlash(c, t); return; }
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 400, 440, 1.1]]); feteNB(cc, t, { manege: 300 });
    for (const [x, v] of [[150, 3], [240, 2], [520, 1], [610, 4]]) dessine(cc, figurant(t, x, v, { s: .46, y: 800, face: x < 300 ? 1 : -1, rire: (Math.floor(t * 3) + v) % 2, sourire: 1.4, chapeau: [COIFFE.casquette, COIFFE.foulard][v % 2], look: [.6, 0] })); });
  debutFlash(c, t);
}
