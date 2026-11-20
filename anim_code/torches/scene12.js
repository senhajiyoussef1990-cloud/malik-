// SCÈNE 12 — Plans 22-23 (TV). s12a : une grande main colle l'étiquette « LIBERTÉ » sur un simple paquet de cigarettes ; des étoiles jaillissent.
// s12b : la fumée de la cigarette monte… et dessine les barreaux d'une cage.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 420, 1.06]]); cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); F(cc, poly([[0, 560], [W, 560], [W, H], [0, H]]), GRIS.fonce, 0);
      paquetNB(cc, 540, 420, 3.2, 'CIGARETTES');
      const u = ease(seg(la, .3, 1.3)); cc.save(); cc.translate(lerp(1000, 540, u), lerp(100, 420, u)); cc.rotate(-.08 * (1 - u)); F(cc, poly([[-130, -36], [130, -36], [130, 36], [-130, 36]]), GRIS.blanc, 4); cc.font = 'bold 50px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LIBERTÉ', 0, 18);
      F(cc, smooth([[100, -50], [200, -90], [260, -60], [240, 20], [140, 40]]), GRIS.peau, 3); cc.restore();
      if (u > .95) for (let k = 0; k < 8; k++) { const a = k * .785 + t, r = 260 + Math.sin(t * 6 + k) * 20; etoile(cc, 540 + Math.cos(a) * r, 420 + Math.sin(a) * r * .6, 16); }
    } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 380, 1.06]]); cageFumee(cc, t, seg(lb, .3, B[1])); }
  });
  debutFlash(c, t);
}
