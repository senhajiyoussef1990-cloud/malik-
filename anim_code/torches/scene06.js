// SCÈNE 06 — Plans 10-11 (TV). s06a : chez le psychanalyste (divan, statuettes, bibliothèque), le docteur barbu prend des notes ; une bulle montre la cigarette qui se change en torche.
// s06b : à son bureau, Bernays raye « CIGARETTES » sur son carnet et écrit en grand « LIBERTÉ » ; derrière lui, la silhouette de la statue au flambeau.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 600, 420, 1.12], [B[0], 620, 400, 1.18]]);
      const Ps = PSY(t, 940, { face: -1, look: [-.6, .4], handR: [-80, -560], poseR: 'poing' }), Bn = BERNAYS(t, 640, { y: 600, face: 1, look: [.8, -.2], chapeau: false, sourire: .5 });
      Bn.lean = -.25;
      cabinetPsyNB(cc, t, { derriere: (c2) => dessine(c2, Bn, drawVendeur) }); dessine(cc, Ps);
      const h = mainF(Ps, 1); F(cc, poly([[h[0] - 30, h[1] - 10], [h[0] + 30, h[1] - 10], [h[0] + 30, h[1] + 30], [h[0] - 30, h[1] + 30]]), GRIS.blanc, 2);
      bulleTorche(cc, 780, 170, .9, seg(la, A[1] * .3, A[1] * .9), t);
    } else {
      cam(cc, t, [[B[0], 540, 420, 1.12], [DUREE, 540, 400, 1.2]]);
      cc.fillStyle = '#d8d4ca'; cc.fillRect(0, 0, W, 640); cc.fillStyle = '#6e6a62'; cc.fillRect(0, 640, W, H - 640);
      F(cc, poly([[620, 80], [960, 80], [960, 520], [620, 520]]), GRIS.blanc, 4); F(cc, poly([[760, 500], [820, 500], [810, 300], [770, 300]]), GRIS.moyen, 2); F(cc, ell(790, 270, 34, 40), GRIS.moyen, 2); F(cc, poly([[820, 260], [880, 120], [900, 128], [836, 270]]), GRIS.moyen, 2); F(cc, smooth([[874, 120], [890, 70 - Math.sin(t * 8) * 6], [906, 124]]), GRIS.blanc, 3); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * .3; F(cc, poly([[790 + Math.cos(a) * 36, 240 + Math.sin(a) * 36], [790 + Math.cos(a) * 60, 240 + Math.sin(a) * 60], [790 + Math.cos(a + .06) * 38, 240 + Math.sin(a + .06) * 38]]), GRIS.moyen, 1); }   // la statue au flambeau
      const Bn = BERNAYS(t, 380, { face: 1, look: [.5, .6], chapeau: false, handR: [130, -560], poseR: 'pointe', sourire: .6 }); dessine(cc, Bn, drawVendeur);
      F(cc, poly([[200, 600], [620, 600], [640, 620], [180, 620]]), GRIS.fonce, 4); F(cc, poly([[200, 620], [620, 620], [620, 760], [200, 760]]), '#4a4640', 4);
      cc.save(); cc.translate(470, 560); cc.rotate(-.05); F(cc, poly([[-120, -60], [120, -60], [120, 40], [-120, 40]]), GRIS.blanc, 3); cc.font = 'bold 26px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('CIGARETTES', 0, -24); const r = clamp(seg(lb, .3, 1)); ink(cc, 6, GRIS.noir); cc.beginPath(); cc.moveTo(-90, -32); cc.lineTo(-90 + 180 * r, -20); cc.stroke(); const v = seg(lb, 1, 2); cc.font = 'bold 36px Georgia'; cc.fillText('LIBERTÉ'.slice(0, Math.ceil(7 * v)), 0, 24); cc.restore();
    }
  });
  debutFlash(c, t);
}
