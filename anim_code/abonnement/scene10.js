// SCÈNE 10 — Plans 18-19 (TV). s10a : le vendeur, cigare au bec, devant les cartes de refus jamais renvoyées : « Je n’ai pas besoin qu’ils disent oui. J’ai besoin qu’ils oublient de dire non ! »
// s10b : un écran : « ESSAI GRATUIT — 30 jours », le bouton « JE COMMENCE », et les petites lignes… un clic.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.08]]); cc.fillStyle = '#d4d0c6'; cc.fillRect(0, 0, W, 620); cc.fillStyle = '#7a766e'; cc.fillRect(0, 620, W, H - 620); F(cc, poly([[560, 120], [1000, 120], [1000, 600], [560, 600]]), '#5a564e', 5); for (let k = 0; k < 14; k++) { cc.save(); cc.translate(620 + (k % 5) * 80, 200 + Math.floor(k / 5) * 120); cc.rotate((k % 3 - 1) * .1); F(cc, poly([[-34, -24], [34, -24], [34, 24], [-34, 24]]), GRIS.blanc, 2); cc.font = 'bold 9px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('REFUS', 0, 4); cc.restore(); } const P = voix(VENDEUR(t, 360, { face: 1, look: [.5, -.1], sourire: 1.3, handR: [150, -700], poseR: 'pointe' }), ['s10a'], t); dessine(cc, P, drawVendeur); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); essaiClic(cc, t, seg(lb, .2, B[1])); }
  });
  debutFlash(c, t);
}
