// SCÈNE 07 — Plans 12-13. Le renard montre un journal recopié mot pour mot par plusieurs kiosques : « Un même message peut circuler en boucle. »
// Les habitants se rassemblent sur la place en répétant que le pont est fermé : « À force, le récit semble unanime. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  if (lb < -.1) { const [R, M] = herosTV(t, 160, 920); voix(R, ['s07a'], t); R.handR = [240, -620]; R.poseR = 'pointe'; M.look = [-.6, -.3];
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); for (let k = 0; k < 4; k++) { const x = 270 + k * 180; F(cc, poly([[x - 70, 520], [x + 70, 520], [x + 70, 300], [x - 70, 300]]), GRIS.moyen, 3); F(cc, smooth([[x - 86, 300], [x, 250], [x + 86, 300]]), GRIS.noir, 3); cc.save(); cc.translate(x, 400); F(cc, poly([[-50, -70], [50, -70], [50, 70], [-50, 70]]), GRIS.blanc, 2); cc.font = 'bold 11px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LE PONT', 0, -30); cc.fillText('EST FERMÉ !', 0, -14); cc.restore(); } }, (cc) => heros(cc, R, M));
    debutFlash(c, t); return; }
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 460, 1.15]]); placeNB(cc, t, {});
    for (let k = 0; k < 8; k++) { const P = figurant(t, 100 + k * 120, k + 1, { s: .44, y: 790 + (k % 2) * 16, face: k < 4 ? 1 : -1, look: [k < 4 ? .7 : -.7, 0], talk: .3 * Math.abs(Math.sin(t * 9 + k)), sourcil: .7, chapeau: [COIFFE.casquette, COIFFE.foulard, COIFFE.toque][k % 3] }); dessine(cc, P); } });
  debutFlash(c, t);
}
