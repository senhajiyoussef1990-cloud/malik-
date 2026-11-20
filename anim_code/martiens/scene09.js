// SCÈNE 09 — Plans 16-17 (TV). s09a : le lendemain matin, les unes tournoient l'une après l'autre : « PANIQUE GÉNÉRALE ! Les Martiens de la radio affolent l'Amérique ».
// s09b : devant le kiosque, un jeune crieur brandit le journal : « Panique générale ! Les Martiens ont affolé l'Amérique ! » — les passants achètent.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12 + t * .3; cc.fillStyle = k % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,0)'; cc.beginPath(); cc.moveTo(540, 405); cc.arc(540, 405, 900, a, a + Math.PI / 12); cc.fill(); } for (let k = 0; k < 3; k++) { const v = ease(seg(la, k * .35, k * .35 + .9)); if (v > 0) unePanique(cc, 280 + k * 260, 420, (.2 + .5 * v) * (k === 1 ? 1.15 : .85), { rot: (1 - v) * 8 + (k - 1) * .08 }); } }
    else {
      cam(cc, t, [[B[0], 500, 470, 1.25], [DUREE, 500, 460, 1.3]]);
      const Cr = voix(CRIEUR(t, 220, { face: 1, look: [.3, -.2], sourire: 1, handR: [40, -760], poseR: 'poing' }), ['s09b'], t);
      const Pa = [figurant(t, 640, 1, { s: .46, y: 800, face: -1, look: [-.6, 0], handR: [-60, -560], poseR: 'poing' }), figurant(t, 860, 3, { s: .48, y: 800, face: -1, look: [-.6, 0], chapeau: COIFFE.casquette })];
      kiosqueNB(cc, t, { derriere: (c2) => { dessine(c2, Cr); Pa.forEach(p => dessine(c2, p)); } });
      const h = mainF(Cr, 1); unePanique(cc, h[0] + 6, h[1] - 50, .2, { rot: Math.sin(t * 6) * .08 }); const p = mainF(Pa[0], 1); unePanique(cc, p[0], p[1] - 20, .14, { rot: -.1 });
    }
  });
  debutFlash(c, t);
}
