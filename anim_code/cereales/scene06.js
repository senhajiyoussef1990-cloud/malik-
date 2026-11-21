// SCÈNE 06 — Plans 10-11 (TV). s06a : à la fabrique, le frère fait verser un grand sac « SUCRE » sur les flocons ; la boîte « FLOCONS DE MAÏS, régime de santé » devient « SOLEIL D'OR », mascotte souriante.
// s06b : le frère, en vendeur, brandit la nouvelle boîte : « Un bon petit-déjeuner, et vous serez fort toute la journée ! »
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 600, 420, 1.12]]);
      cuisineFloconsNB(cc, t, { derriere: (c2) => dessine(c2, FRERE(t, 300, { face: 1, look: [.7, .3], sourire: 1, handR: [140, -560], poseR: 'pointe' }), drawVendeur) });
      const v = ease(seg(la, .2, 1)); cc.save(); cc.translate(620, 260 - 40 * v); cc.rotate(-.9 * v); F(cc, smooth([[-50, 60], [-46, -40], [-30, -60], [30, -60], [46, -40], [50, 60]]), GRIS.blanc, 3); cc.font = 'bold 18px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('SUCRE', 0, 10); cc.restore(); if (v > .6) for (let k = 0; k < 20; k++) { const u = (t * 1.5 + k / 20) % 1; F(cc, ell(560 + hash(k) * 120, 300 + u * 120, 3, 3), GRIS.blanc, 0); }
      const tr = seg(la, A[1] * .5, A[1]); cc.save(); cc.translate(900, 400); cc.scale(Math.cos(tr * Math.PI) || .01, 1); cc.restore(); boiteNB(cc, 920, 400, .9, tr < .5 ? { simple: true } : { sucre: true });
    } else {
      cam(cc, t, [[B[0], 520, 400, 1.3], [DUREE, 520, 400, 1.36]]);
      const F2 = voix(FRERE(t, 460, { face: 1, look: [.2, 0], sourire: 1.2, chapeau: false, handR: [150, -760], poseR: 'poing', handL: [-160, -600], poseL: 'ouverte' }), ['s06b'], t);
      cc.fillStyle = '#d8d4ca'; cc.fillRect(0, 0, W, 640); cc.fillStyle = '#76726a'; cc.fillRect(0, 640, W, H - 640); for (let k = 0; k < 6; k++) { cc.fillStyle = k % 2 ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.04)'; cc.fillRect(200 + k * 120, 0, 60, 640); }
      dessine(cc, F2, drawVendeur); const h = mainF(F2, 1); boiteNB(cc, h[0] + 10, h[1] - 60, .5, { sucre: true, slogan: true });
    }
  });
  debutFlash(c, t);
}
