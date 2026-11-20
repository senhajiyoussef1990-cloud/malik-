// SCÈNE 09 — Plans 16-17 (TV). s09a : le biscuitier colle une grosse étoile « NOUVEAU » sur le paquet, tandis qu'une affiche « NOUVELLE RECETTE ! » se déroule au mur.
// s09b : bras ouverts devant l'étagère, il fanfaronne : « Nouvelle recette, nouveau format. Et toujours le même prix ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 600, 400, 1.25], [B[0], 560, 420, 1.12]]);
    const Bs = voix(BISCUITIER(t, 460, { face: 1, look: [.7, .2], sourire: 1 }), ['s09b'], t);
    const colle = ease(seg(la, .2, 1));
    if (lb < 0) { Bs.handR = [lerp(100, 180, colle), lerp(-500, -600, colle)]; Bs.poseR = 'pointe'; }
    else { Bs.handL = [-200, -720]; Bs.handR = [200, -720]; Bs.poseL = Bs.poseR = 'ouverte'; Bs.look = [0, 0]; Bs.sourire = 1.3; }
    epicerieNB(cc, t, { n: 12, derriere: (c2) => { dessine(c2, Bs); } , devant: (c2) => paquetNB(c2, 640, 560, .62, { n: 12, etoile: colle > .9, air: 1 }) });
    const af = ease(seg(la, .6, 1.6)); if (af > 0) { cc.save(); cc.translate(820, 140); cc.beginPath(); cc.rect(-160, -60, 320, 140 * af); cc.clip(); F(cc, poly([[-150, -50], [150, -50], [150, 70], [-150, 70]]), GRIS.blanc, 4); cc.font = 'bold 30px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('NOUVELLE', 0, -6); cc.fillText('RECETTE !', 0, 36); for (const sd of [-1, 1]) etoile(cc, sd * 126, 10, 16); cc.restore(); }
  });
  debutFlash(c, t);
}
