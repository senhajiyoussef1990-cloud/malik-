// SCÈNE 12 — Plans 22-23 (TV). s12a : la phrase, répétée, grossit et s'empile jusqu'à devenir un mur de lettres.
// s12b : des millions de boîtes s'étendent jusqu'à l'horizon, chacune avec le même bandeau.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 405, 1.0]]);
    if (lb < 0) { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); const n = Math.floor(seg(la, 0, A[1]) * 12) + 1; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; for (let k = 0; k < n; k++) { cc.font = `bold ${18 + k * 4}px Georgia`; cc.globalAlpha = .35 + .65 * (k + 1) / n; cc.fillText('LE REPAS LE PLUS IMPORTANT', 540, 760 - k * 58); } cc.globalAlpha = 1; }
    else { cc.fillStyle = '#e8e6e0'; cc.fillRect(0, 0, W, 300); cc.fillStyle = '#a8a49a'; cc.fillRect(0, 300, W, H - 300); for (let r = 0; r < 7; r++) { const s = .12 + r * .07, y = 320 + r * r * 12 + r * 20, n = Math.ceil(W / (180 * s)) + 1; for (let k = 0; k < n; k++) boiteNB(cc, k * 180 * s + (r % 2) * 90 * s, y, s, { slogan: true, sucre: true }); } }
  });
  debutFlash(c, t);
}
