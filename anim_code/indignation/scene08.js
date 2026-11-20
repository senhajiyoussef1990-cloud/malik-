// SCÈNE 08 — Plans 14-15 (TV). Un client répète le titre, outré : « C'est honteux ! Il faut le dire à tous ! »
// La nouvelle passe de kiosque en kiosque, chaque titre plus fort : « Chaque relais augmente le volume. »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    if (lb < -.1) { cam(cc, t, [[0, 540, 470, 1.3]]); placeFeteNB(cc, t, { enfants: false, flaque: false, travaux: false, foule: false }); const C = figurant(t, 560, 0, { s: .5, y: 800, face: 1, look: [.6, -.2], froncer: 1, sourire: -1, chapeau: COIFFE.casquette }); voix(C, ['s08a'], t); C.handR = [200, -760]; C.poseR = 'poing'; C.handL = [-160, -620]; C.poseL = 'ouverte'; dessine(cc, C); }
    else { cam(cc, t, [[0, 540, 405, 1.0]]); cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); paves(cc, 600); const u = seg(lb, 0, B[1]);
      [['incident', 22], ['AGRESSION !', 30], ['SCANDALE !!', 38], ['HONTE À TOUS !!!', 30]].forEach(([titre, ta], k) => { if (u * 4 < k) return; kiosqueTitre(cc, 160 + k * 250, 640, .9 + k * .12, titre, ta); }); }
  });
  debutFlash(c, t);
}
