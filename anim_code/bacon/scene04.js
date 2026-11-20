// SCÈNE 04 — Plans 06-07 (TV). s04a : une famille de 1925 déjeune léger, café et pain ; le père lit le journal, la mère sert le café.
// s04b : coupe sur le bureau de la salaison « BACON SUPRÊME » : le graphique des ventes reste plat, le charcutier se gratte la tête.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 560, 470, 1.2], [B[0], 560, 450, 1.12]]);
      const P = PERE(t, 360, { face: 1, look: [.4, .5], handL: [-40, -470], handR: [80, -470], poseL: 'poing', poseR: 'poing' });
      const Mr = MERE(t, 820, { face: -1, look: [.6, .4], handR: [120, -520], poseR: 'poing', sourire: .5 });
      cuisineNB(cc, t, { menu: 'leger', annee: 1925, pere: P, mere: Mr, poele: false });
      const a = mainF(P, -1), b = mainF(P, 1); cc.save(); cc.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 20); F(cc, poly([[-90, -70], [90, -70], [90, 70], [-90, 70]]), GRIS.blanc, 3); cc.font = 'bold 15px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('THE DAILY NEWS', 0, -46); ink(cc, 1.2, 'rgba(0,0,0,.35)'); for (let r = 0; r < 6; r++) { cc.beginPath(); cc.moveTo(-80, -26 + r * 14); cc.lineTo(80, -26 + r * 14); cc.stroke(); } cc.restore();
      const m = mainF(Mr, 1); cc.save(); cc.translate(m[0], m[1]); cc.rotate(-.5 - .25 * Math.sin(t * 2) ** 2); F(cc, smooth([[-26, -50], [26, -50], [34, 30], [-34, 30]]), GRIS.fonce, 3); F(cc, poly([[-26, -40], [-60, -60], [-56, -48]]), GRIS.fonce, 2); cc.restore();   // la cafetière
    } else {
      cam(cc, t, [[B[0], 540, 420, 1.15], [DUREE, 600, 400, 1.22]]);
      const C = CHARCUTIER(t, 520, { face: 1, look: [.9, -.3], handL: [-60, -760], poseL: 'pointe', froncer: .6 });
      if (lb > B[1] * .5) { C.handL = [-30, -790]; C.tilt += Math.sin(t * 9) * .03; C.sourcil = 1; }
      bureauNB(cc, t, { ventes: 0, derriere: (c2) => dessine(c2, C) });
    }
  });
  debutFlash(c, t);
}
