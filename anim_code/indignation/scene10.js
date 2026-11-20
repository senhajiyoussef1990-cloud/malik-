// SCÈNE 10 — Plans 18-19. Le passant montre les fleurs ramassées ensemble, en souriant : « Nous nous sommes aidés. Personne ne s'est battu. »
// Le mouton regarde une bande de plusieurs images montrant l'incident en entier : « Une seule image changeait tout le sens. »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < -.1) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 600, 460, 1.3]]); placeFeteNB(cc, t, { enfants: false, flaque: false, travaux: false, foule: false }); const P = figurant(t, 680, 2, { s: .48, y: 790, face: -1, chapeau: COIFFE.casquette, look: [.8, 0], sourire: 1.1 }); voix(P, ['s10a'], t); P.handR = [200, -600]; P.poseR = 'poing'; dessine(cc, P); bouquet(cc, ...mainF(P, 1), .8, 1); dessine(cc, FACTEUR(t, 480, { sourire: 1, look: [.8, 0] })); }); debutFlash(c, t); return; }
  const [R, M] = herosTV(t, 160, 920); voix(M, ['s10b'], t); M.look = [-.5, -.3]; M.sourcil = .9; M.oreille = .2;
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); F(cc, poly([[100, 220], [980, 220], [980, 520], [100, 520]]), GRIS.noir, 3); for (let k = 0; k < 14; k++) { F(cc, poly([[110 + k * 63, 230], [140 + k * 63, 230], [140 + k * 63, 250], [110 + k * 63, 250]]), GRIS.blanc, 0); F(cc, poly([[110 + k * 63, 490], [140 + k * 63, 490], [140 + k * 63, 510], [110 + k * 63, 510]]), GRIS.blanc, 0); }
    [0, 1, 2].forEach((m) => photoMoment(cc, 250 + m * 290, 370, 250, m, 0)); cc.font = 'bold 20px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; ['avant', 'le faux pas', 'l’entraide'].forEach((l, m) => cc.fillText(l, 250 + m * 290, 580)); }, (cc) => heros(cc, R, M));
}
