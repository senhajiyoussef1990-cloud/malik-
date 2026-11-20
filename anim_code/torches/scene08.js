// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard montre les photographes qui attendent déjà sur le trottoir, appareils à soufflet sur trépied : « Et il a prévenu les photographes, bien avant. »
// s08b : le défilé de Pâques sur la Cinquième Avenue : drapeaux, foule endimanchée aux chapeaux fleuris ; les trois jeunes femmes allument leurs cigarettes ; les flashs au magnésium éclatent.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const photographes = (c2, tt, flash) => { for (let k = 0; k < 3; k++) { const x = 160 + k * 170; appareil(c2, x, 560, .9, -.1); const P = figurant(tt, x - 50, [0, 2, 3][k], { s: .44, y: 790, face: 1, chapeau: COIFFE.casquette, look: [.8, -.1], handR: [80, -620], poseR: 'poing' }); dessine(c2, P); if (flash && hash(Math.floor(tt * 3) + k) > .5) { const g = c2.createRadialGradient(x + 60, 520, 4, x + 60, 520, 120); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c2.fillStyle = g; c2.fillRect(x - 60, 400, 240, 240); for (let q = 0; q < 3; q++) { const u = (tt * 2 + q * .3) % 1; F(c2, ell(x + 60, 500 - u * 80, 20 + u * 30, 14 + u * 20), `rgba(255,255,255,${.5 * (1 - u)})`, 0); } } } };
  if (lb < 0) {
    const [R, M] = herosTV(t, 820, 950); voix(R, ['s08a'], t); R.face = -1; M.face = -1; R.look = [.8, 0]; M.look = [.8, 0];
    if (la >= 0) { R.handL = [-230, -640]; R.poseL = 'pointe'; R.sourire = .7; R.lid = .5; }
    nbEtCouleur(c, t, [[0, 560, 430, 1.1]], (cc) => avenueNB(cc, t, { drapeaux: 1, derriere: (c2) => photographes(c2, t, false) }), (cc) => heros(cc, R, M));
  } else {
    enNoirEtBlanc(c, t, (cc) => {
      cam(cc, t, [[B[0], 600, 420, 1.05], [DUREE, 700, 430, 1.18]]);
      avenueNB(cc, t, { drapeaux: 1, foule: 9, regard: .5, derriere: (c2) => {
        const D = [0, 1, 2].map(k => marche(DEBUTANTE(t, 700 + k * 110 - lb * 20, k, { face: -1, look: [-.3, -.2], sourire: 1, chapeau: CLOCHE_PAQUES(k) }), t, 5));
        const al = seg(lb, .8, 1.6); D.forEach(d => { d.handR = [-50, lerp(-420, -680, al)]; d.poseR = 'poing'; }); D.forEach(d => dessine(c2, d)); D.forEach(d => { const h = mainF(d, 1); cigaretteNB(c2, h[0], h[1] - 6, .55, -2.4, al > .9 ? 1 : 0, t); });
        photographes(c2, t, lb > 1.4); } });
    });
  }
  debutFlash(c, t);
}
