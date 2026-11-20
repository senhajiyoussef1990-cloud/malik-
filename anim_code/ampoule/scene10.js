// SCÈNE 10 — Plans 18-19 (TV). s10a : le calendrier tourne jusqu'en 1939 ; la plaque « CARTEL PHŒBUS » se fend et tombe… mais une petite ampoule « 1 000 h » reste posée sur la table.
// s10b : en Californie, dans une caserne de pompiers, avec son camion et son échelle : une vieille ampoule brille au plafond, pancarte « ALLUMÉE DEPUIS 1901 ».
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.05]]); const u = seg(la, 0, A[1]); geneveNB(cc, t, {}); calendrier(cc, 900, 220, 1.1, Math.round(1925 + 14 * ease(clamp(u * 1.5))), 'SEPT.'); const ch = ease(seg(la, A[1] * .6, A[1])); cc.save(); cc.translate(540, 470 + ch * 120); cc.rotate(ch * .3); F(cc, poly([[-200, -40], [200, -40], [200, 40], [-200, 40]]), GRIS.noir, 4); cc.font = 'bold 34px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.fillText('CARTEL PHŒBUS', 0, 12); if (ch > .3) { ink(cc, 4, GRIS.clair); cc.beginPath(); cc.moveTo(-20, -40); cc.lineTo(10, 0); cc.lineTo(-10, 40); cc.stroke(); } cc.restore(); ampouleNB(cc, 540, 560, .5, .7); }
    else { cam(cc, t, [[B[0], 820, 330, 1.3], [DUREE, 700, 380, 1.08]]); caserneNB(cc, t, { derriere: (c2) => dessine(c2, POMPIER(t, 640, { face: 1, look: [.6, -.7], sourire: 1 })) }); }
  });
  debutFlash(c, t);
}
