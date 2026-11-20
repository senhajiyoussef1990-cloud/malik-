// SCÈNE 04 — Plans 06-07 (TV). s04a : sur l'avenue, une femme sort une cigarette : les passants s'arrêtent, choqués ; un policier siffle et la montre du doigt.
// s04b : carton : le camembert des clients du tabac — les hommes d'un côté, et la moitié « FEMMES » qui manque, en pointillés.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 430, 1.12], [B[0], 560, 440, 1.2]]);
      const choc = la > A[1] * .4;
      const Fm = figurant(t, 560, 4, { s: .5, y: 790, face: 1, look: [.3, -.2], chapeau: CLOCHE(1), handR: [70, -650], poseR: 'poing', sourire: .4 });
      const Po = POLICIER(t, 860, { face: -1, look: [-.9, 0], froncer: choc ? 1 : 0 }); if (choc) { Po.handL = [-200, -660]; Po.poseL = 'pointe'; Po.handR = [10, -700]; Po.poseR = 'poing'; }
      avenueNB(cc, t, { foule: 6, choc, regard: .3, derriere: (c2) => { dessine(c2, Fm); dessine(c2, Po); } });
      const h = mainF(Fm, 1); cigaretteNB(cc, h[0], h[1] - 8, .6, -.4, 1, t);
      if (choc) { const s = mainF(Po, 1); for (let k = 0; k < 3; k++) { ink(cc, 3, GRIS.noir); const a = -1.2 + k * .4; cc.beginPath(); cc.moveTo(s[0] + Math.cos(a) * 20, s[1] - 30 + Math.sin(a) * 20); cc.lineTo(s[0] + Math.cos(a) * 40, s[1] - 30 + Math.sin(a) * 40); cc.stroke(); } F(cc, poly([[s[0] - 8, s[1] - 30], [s[0] + 12, s[1] - 30], [s[0] + 12, s[1] - 20], [s[0] - 8, s[1] - 20]]), GRIS.clair, 1.5); }   // le sifflet
    } else { cam(cc, t, [[B[0], 540, 405, 1.0]]); camembert(cc, t, seg(lb, .4, B[1])); }
  });
  debutFlash(c, t);
}
