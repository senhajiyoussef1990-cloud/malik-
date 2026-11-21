// SCÈNE 12 — Plans 22-23 (TV). s12a : un « petit souci » rebaptisé d'un nom médical gonfle, gonfle, jusqu'à remplir l'écran.
// s12b : au magasin, un client affolé rafle trois flacons sans même lire le prix.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 420, 1.3]]); motGeant(cc, t, seg(la, 0, A[1])); }
    else { cam(cc, t, [[B[0], 540, 430, 1.15]]); cc.fillStyle = '#d8d4ca'; cc.fillRect(0, 0, W, 640); cc.fillStyle = '#76726a'; cc.fillRect(0, 640, W, H - 640); for (let r = 0; r < 2; r++) { F(cc, poly([[100, 300 + r * 140], [980, 300 + r * 140], [980, 312 + r * 140], [100, 312 + r * 140]]), GRIS.fonce, 2); for (let k = 0; k < 14; k++) flaconNB(cc, 140 + k * 60, 298 + r * 140, .34); } etiquette(cc, 880, 220, '2 $', 1.2, .1);
      const C2 = figurant(t, 520, 2, { s: .5, y: 790, face: 1, look: [.6, -.2], sourcil: 1, froncer: .5, handL: [-40, -560], handR: [60, -560], poseL: 'poing', poseR: 'poing' }); C2.bob += Math.abs(Math.sin(t * 10)) * 6; dessine(cc, C2); const a = mainF(C2, -1), b = mainF(C2, 1); for (let k = 0; k < 3; k++) flaconNB(cc, (a[0] + b[0]) / 2 - 30 + k * 30, (a[1] + b[1]) / 2 + 20, .3); }
  });
  debutFlash(c, t);
}
