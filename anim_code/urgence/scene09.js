// SCÈNE 09 — Plans 16-17 (TV). « Un compte à rebours peut n'être qu'un décor » : le même sablier, remis en place à toutes les heures.
// « Mais certaines échéances sont authentiques » : un second stand affiche une vraie date de fin pour des fraises du jour.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 540, 405, 1.0]]);
    if (lb < -.1) { const h = 9 + Math.floor(seg(la, 0, A[1]) * 6); standNB(cc, t, { panneau: 1, sablier: (la * 2) % 1, heure: h }); cc.save(); cc.font = 'bold 36px Georgia'; cc.fillStyle = GRIS.noir; cc.fillText(h + ' h', 900, 190); cc.restore(); }
    else { standFrais(cc, t); dessine(cc, figurant(t, 200, 1, { s: .5, y: 790, face: 1, tablier: 'blanc', chapeau: COIFFE.foulard, look: [.8, 0], sourire: .8, handR: [160, -600], poseR: 'ouverte' })); }
  });
  debutFlash(c, t);
}
