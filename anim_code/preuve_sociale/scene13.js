// SCÈNE 13 — Plan 23 (TV). « Il vérifie ce qui compte pour lui. » Gros plan : la doublure, l'étiquette, une loupe sur la couture.
const A = L.s13a, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : A[0] + A[1] + 0.54);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const u = ease(seg(t, .2, DUREE - .3));
    cam(cc, t, [[0, 540, 405, 1.0], [DUREE, 560, 420, 1.12]]);
    cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H);
    // le chapeau retourné, vu de dessus : doublure satinée, bande intérieure, étiquette cousue
    F(cc, ell(540, 420, 420, 300), GRIS.moyen, 6); F(cc, ell(540, 420, 300, 210), GRIS.noir, 5);
    const doub = ell(540, 420, 270, 186); F(cc, doub, GRIS.clair, 4);
    cc.save(); cc.clip(doub); for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; ink(cc, 2, 'rgba(0,0,0,.18)'); cc.beginPath(); cc.moveTo(540, 420); cc.quadraticCurveTo(540 + Math.cos(a + .3) * 160, 420 + Math.sin(a + .3) * 110, 540 + Math.cos(a) * 300, 420 + Math.sin(a) * 210); cc.stroke(); }
    const g = cc.createRadialGradient(470, 360, 10, 540, 420, 280); g.addColorStop(0, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); cc.fillStyle = g; cc.fillRect(0, 0, W, H); cc.restore();
    ink(cc, 3, GRIS.blanc); cc.setLineDash([10, 8]); cc.beginPath(); cc.ellipse(540, 420, 286, 198, 0, 0, 7); cc.stroke(); cc.setLineDash([]);   // couture
    F(cc, poly([[410, 380], [670, 380], [670, 460], [410, 460]]), GRIS.blanc, 3); ink(cc, 2, GRIS.fonce); cc.setLineDash([5, 4]); cc.strokeRect(418, 388, 244, 64); cc.setLineDash([]);
    cc.save(); cc.font = 'bold 22px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LAINE · FAIT MAIN', 540, 418); cc.font = 'italic 16px Georgia'; cc.fillText('Taille 7', 540, 442); cc.restore();
    // main gantée et loupe qui suit la couture
    const a = -2.4 + u * 2.2, lx = 540 + Math.cos(a) * 286, ly = 420 + Math.sin(a) * 198;
    const L2 = ell(lx, ly, 78, 78); F(cc, L2, 'rgba(255,255,255,.15)', 8); cc.save(); cc.clip(L2); cc.translate(lx, ly); cc.scale(1.6, 1.6); cc.translate(-lx, -ly);
    ink(cc, 3, GRIS.blanc); cc.setLineDash([10, 8]); cc.beginPath(); cc.ellipse(540, 420, 286, 198, 0, 0, 7); cc.stroke(); cc.setLineDash([]); cc.restore();
    ink(cc, 18, GRIS.noir); cc.beginPath(); cc.moveTo(lx + 55, ly + 55); cc.lineTo(lx + 150, ly + 150); cc.stroke();
    gant(cc, lx + 160, ly + 170, -.8, 1.6, 'poing');
  });
  debutFlash(c, t);
}
