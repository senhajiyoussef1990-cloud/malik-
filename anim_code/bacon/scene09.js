// SCÈNE 09 — Plans 16-17 (TV). s09a : la presse tourne, le journal arrive en tournoyant : « LES MÉDECINS RECOMMANDENT UN PETIT-DÉJEUNER COPIEUX ! »
// s09b : la caméra glisse sur la photo de la une : une assiette d'œufs… et de bacon, qui fume.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    const z = ease(seg(lb, 0, 1.2));
    cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.0], [B[0] + 1.2, 470, 560, 2.1], [DUREE, 470, 560, 2.2]]);
    cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12 + t * .3; cc.fillStyle = k % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,0)'; cc.beginPath(); cc.moveTo(540, 405); cc.arc(540, 405, 900, a, a + Math.PI / 12); cc.fill(); }
    const v = ease(seg(la, 0, 1.1)), rot = (1 - v) * 9, s = .2 + .95 * v;
    uneJournal(cc, 540, 420, s * .78, { rot, titre: seg(la, .9, A[1] * .9), photo: true });
    if (lb >= 0) { cc.save(); cc.translate(540, 420); cc.scale(.78 * 1.15, .78 * 1.15); for (let k = 0; k < 3; k++) { const u = (lb * .7 + k * .33) % 1; ink(cc, 3, `rgba(255,255,255,${.7 * (1 - u)})`); cc.beginPath(); cc.moveTo(-115 + k * 20, 150 - u * 60); cc.quadraticCurveTo(-125 + k * 20, 130 - u * 60, -115 + k * 20, 110 - u * 60); cc.stroke(); } cc.restore(); }
  });
  debutFlash(c, t);
}
