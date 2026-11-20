// SCÈNE 09 — Plans 16-17 (TV). Un troisième photographe recule de plusieurs pas : la vue large montre aussi les travaux à côté de la fontaine.
// Puis le carnet des comptes de la commune s'ouvre : coûts, réparation, visiteurs.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    if (lb < -.1) {
      const rec = ease(seg(la, .1, A[1]));
      cam(cc, t, [[0, 540, 405, 1.0]]);
      placeFeteNB(cc, t, {});
      const P = PHOTOGRAPHE(t, lerp(540, 470, rec), 2, { y: 800, face: 1, look: [0, -.2] }); if (rec > 0 && rec < 1) marche(P, t, 6); dessine(cc, P); appareil(cc, P.x + 50, 590, .9, -1.57 + .2);
      cadreTrait(cc, [lerp(300, 30, rec), lerp(450, 260, rec), lerp(480, 1020, rec), lerp(330, 530, rec)], 1, 'photo n°3');
    } else { cam(cc, t, [[0, 540, 405, 1.0]]); cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); const o = ease(seg(lb, 0, .5)); cc.save(); cc.translate(540, 420); cc.scale(o, 1); carnetCouts(cc, 0, 0, 1.3, seg(lb, .3, B[1])); cc.restore(); }
  });
  debutFlash(c, t);
}
