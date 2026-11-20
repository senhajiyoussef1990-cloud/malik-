// SCÈNE 05 — Plans 08-09 (TV). s05a : dans son bureau « TABACS DE LUXE & Cie », le fabricant en gilet blanc, cigare aux lèvres, tape sur le graphique plat : « Si les femmes fumaient dehors… »
// s05b : il décroche le téléphone ; l'image se partage : de l'autre côté, Bernays répond dans son bureau ; carton « EDWARD BERNAYS — spécialiste de l'opinion ».
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 520, 420, 1.15], [B[0], 540, 420, 1.1]]);
    const Fb = voix(FABRICANT(t, 520, { face: 1, look: [.7, -.2], sourire: .6 }), ['s05a'], t);
    if (la >= 0 && lb < 0) { const k = Math.abs(Math.sin(la * 4)); Fb.handR = [200, lerp(-560, -700, k)]; Fb.poseR = 'pointe'; }
    if (lb >= 0) { Fb.handL = [-60, -720]; Fb.poseL = 'poing'; Fb.look = [-.3, 0]; }
    bureauTabacNB(cc, t, { ventes: 0, derriere: (c2) => dessine(c2, Fb) });
    const h = mainF(Fb, -1); if (lb >= 0) { F(cc, smooth([[h[0] - 10, h[1] - 30], [h[0] + 10, h[1] - 30], [h[0] + 6, h[1] + 20], [h[0] - 6, h[1] + 20]]), GRIS.noir, 2); }
    const bo = [Fb.x + 38, Fb.y - 352]; F(cc, poly([[bo[0], bo[1] - 3], [bo[0] + 44, bo[1] - 6], [bo[0] + 44, bo[1] + 3], [bo[0], bo[1] + 4]]), GRIS.fonce, 1.5); for (let k = 0; k < 2; k++) { const u = (t * .4 + k * .5) % 1; ink(cc, 3, `rgba(255,255,255,${.6 * (1 - u)})`); cc.beginPath(); cc.moveTo(bo[0] + 46, bo[1] - u * 60); cc.quadraticCurveTo(bo[0] + 60, bo[1] - 20 - u * 60, bo[0] + 48, bo[1] - 40 - u * 60); cc.stroke(); }   // le cigare
    if (lb >= 0) { const k = ease(seg(lb, .3, .8)); cc.save(); cc.beginPath(); cc.rect(1080 - 470 * k, 0, 470, 810); cc.clip(); cc.fillStyle = '#dcd8ce'; cc.fillRect(600, 0, 480, 810); cc.fillStyle = '#76726a'; cc.fillRect(600, 640, 480, 170); ink(cc, 8, GRIS.noir); cc.beginPath(); cc.moveTo(610, 0); cc.lineTo(610, 810); cc.stroke();
      const Bn = BERNAYS(t, 840, { face: -1, look: [-.6, 0], sourire: .8, chapeau: false, handR: [-60, -720], poseR: 'poing' }); dessine(cc, Bn, drawVendeur); const hb = mainF(Bn, 1); F(cc, smooth([[hb[0] - 10, hb[1] - 30], [hb[0] + 10, hb[1] - 30], [hb[0] + 6, hb[1] + 20], [hb[0] - 6, hb[1] + 20]]), GRIS.noir, 2);
      const k2 = ease(seg(lb, 1, 1.5)); if (k2 > 0) { cc.globalAlpha = k2; F(cc, poly([[630, 690], [1060, 690], [1060, 780], [630, 780]]), GRIS.noir, 3); ink(cc, 2, GRIS.blanc); cc.strokeRect(640, 700, 410, 70); cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.font = 'bold 28px Georgia'; cc.fillText('EDWARD BERNAYS', 845, 732); cc.font = 'italic 18px Georgia'; cc.fillText('spécialiste de l’opinion', 845, 758); } cc.restore(); }
  });
  debutFlash(c, t);
}
