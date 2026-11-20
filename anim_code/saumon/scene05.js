// SCÈNE 05 — Plans 08-09 (TV). s05a : au ministère de la Pêche, un délégué norvégien frappe la table devant un saumon : « Le Japon adore le poisson cru. Vendons-leur notre saumon ! »
// s05b : coupe sur un marché de Tokyo : sur le gril, des filets de saumon cuisent ; panneau « À CUIRE SEULEMENT ».
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 520, 420, 1.15], [B[0], 540, 420, 1.12]]);
      const D = voix(DELEGUE(t, 540, { face: 1, look: [.3, .3], sourire: .8 }), ['s05a'], t);
      if (la >= 0) { const k = Math.abs(Math.sin(la * 4.5)); D.handR = [150, lerp(-520, -690, k)]; D.poseR = 'poing'; D.handL = [-160, -620]; D.poseL = 'ouverte'; }
      const D2 = figurant(t, 300, 2, { face: 1, s: .5, y: 790, look: [.8, 0] }), D3 = figurant(t, 790, 0, { face: -1, s: .5, y: 790, look: [-.8, 0] });
      if (la > A[1] * .6) { D2.tilt += Math.sin(t * 6) * .04; D3.tilt += Math.sin(t * 6 + 1) * .04; D2.sourire = D3.sourire = 1; }
      ministereNB(cc, t, { derriere: (c2) => { dessine(c2, D2); dessine(c2, D3); dessine(c2, D, drawVendeur); } });
    } else {
      cam(cc, t, [[B[0], 540, 420, 1.12], [DUREE, 540, 440, 1.2]]);
      const Ch = CHEFFE(t, 760, { face: -1, look: [-.6, .6], handR: [-60, -560], poseR: 'poing', sourire: .5 });
      marcheNB(cc, t, { grill: 1, etal: false, panneau: [300, 360], derriere: (c2) => dessine(c2, Ch) });
      const h = mainF(Ch, 1); cc.save(); cc.translate(h[0], h[1]); cc.rotate(.6); F(cc, poly([[-3, 0], [3, 0], [3, 90], [-3, 90]]), GRIS.clair, 1.5); cc.restore();
    }
  });
  debutFlash(c, t);
}
