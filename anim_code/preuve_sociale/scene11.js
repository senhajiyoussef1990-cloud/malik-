// SCÈNE 11 — Plans 18-21 (TV). s11a : tous portent le même chapeau et comparent leurs silhouettes.
// s11b (voix du renard) : « Pourquoi ce modèle, précisément ? » — le passant ouvre la bouche, puis hésite.
// s11c (passant) : « Eh bien… tout le monde le porte. » — grand geste vers la foule.
// s11d : la caméra compare deux détails de fabrication : couture lâche du chapeau à la mode / point serré d'un chapeau simple.
const A = L.s11a, B = L.s11b, C = L.s11c, Dd = L.s11d, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : Dd[0] + Dd[1] + 1.1);
function detail(c, t, x, y, bon) {                              // gros plan sur la couture du bord d'un chapeau
  c.save(); c.translate(x, y); c.scale(1.55, 1.55);
  const bord = smooth([[-230, 40], [-200, -60], [0, -90], [200, -60], [230, 40], [0, 70]]);
  F(c, bord, bon ? GRIS.fonce : GRIS.moyen, 6); ombre(c, bord, -230, 0, 230, 0, .3);
  c.save(); c.clip(bord); ink(c, 1, 'rgba(0,0,0,.2)'); for (let k = -30; k < 30; k++) { c.beginPath(); c.moveTo(k * 10, -100); c.lineTo(k * 10 + 40, 80); c.stroke(); } c.restore();   // trame du tissu
  F(c, poly([[-226, -6], [226, -6], [226, 14], [-226, 14]]), bon ? GRIS.noir : GRIS.blanc, 3);
  if (bon) { ink(c, 3, GRIS.blanc); for (let k = -10; k <= 10; k++) { c.beginPath(); c.moveTo(k * 20 - 6, 4); c.lineTo(k * 20 + 6, 4); c.stroke(); } }   // point régulier
  else { ink(c, 3, GRIS.noir); for (let k = -10; k <= 10; k++) { if (k % 4 === 1) continue; const dy = hash(k) * 10 - 5; c.beginPath(); c.moveTo(k * 20 - 7, 4 + dy); c.lineTo(k * 20 + 5, 4 - dy); c.stroke(); }
    ink(c, 2, GRIS.noir); c.beginPath(); c.moveTo(-40, 6); c.bezierCurveTo(-30, 40, -60, 60, -36 + Math.sin(t * 3) * 6, 90); c.stroke(); c.beginPath(); c.moveTo(80, 8); c.bezierCurveTo(96, 30, 70, 50, 90 + Math.sin(t * 2.4) * 5, 70); c.stroke();   // fils qui pendent
    F(c, smooth([[120, 20], [150, 16], [150, 44], [124, 40]]), GRIS.blanc, 2); }                   // colle qui déborde
  c.restore();
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lD = t - Dd[0];
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), lA = t - A[0], lB = t - B[0], lC = t - C[0];
    if (lD < -.25) {
      cam(cc, t, [[0, 420, 430, 1.05], [A[0] + A[1], 420, 430, 1.1], [B[0] - .1, 450, 360, 1.9], [C[0] + .2, 430, 400, 1.55], [Dd[0], 420, 420, 1.3]]);
      chapellerieNB(cc, t, { spot: .5, panneau: 1, vedette: false });
      const V = marchandBase(t, 720); V.face = -1; V.sourire = 1.3; V.handL = [-60, -440]; V.handR = [60, -440]; V.poseL = V.poseR = 'poing'; dessine(cc, V, drawVendeur);
      file(cc, t, 9, { chapeaux: 9, modif: (P, k) => {
        if (lA >= 0 && lB < 0) { P.look = [hash(k * 7 + Math.floor(lA * 2)) > .5 ? .9 : -.9, .1]; P.tilt = wob(tq, .9, .07, k); if (k % 2) { P.handR = [70, -560]; P.poseR = 'ouverte'; } }   // ils comparent leurs silhouettes
        if (k === 1) { P.v = 3;
          if (lB >= 0 && lC < 0) { P.look = [0, -.4]; P.talk = lB > B[1] * .4 ? .25 : 0; P.sourcil = .8; P.handR = [60, -640]; P.poseR = 'poing'; P.tilt = .06; }   // il ouvre la bouche… et hésite
          if (lC >= 0) { voix(P, ['s11c'], t); const k2 = ease(seg(lC, C[1] * .3, C[1] * .3 + .35)); P.handR = [lerp(60, -260, k2), lerp(-560, -700, k2)]; P.poseR = 'ouverte'; P.handL = [-80, -420]; P.sourire = 1; P.look = [-.9, -.1]; } }
      } });
    } else {                                                                       // insert : deux détails de fabrication
      const u = ease(seg(lD, .4, Dd[1]));
      cam(cc, t, [[0, 540, 405, 1]]);
      cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); ink(cc, 1.4, 'rgba(0,0,0,.1)'); for (let y = 0; y < H; y += 8) { cc.beginPath(); cc.moveTo(0, y); cc.lineTo(W, y + 20); cc.stroke(); }   // velours du fond
      cc.save(); cc.translate(-u * 760, 0);
      detail(cc, t, 540, 440, false); cc.save(); cc.font = 'bold 34px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('LE CHAPEAU DE L\'ANNÉE', 540, 200); cc.restore(); etoile(cc, 290, 190, 18); etoile(cc, 790, 190, 18);
      detail(cc, t, 1300, 440, true); cc.save(); cc.font = 'italic 32px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('un chapeau simple', 1300, 200); cc.restore();
      cc.restore();
    }
  });
  if (lD > -.25 && lD < .1) flash(c, 1 - Math.abs(lD + .075) / .175);
  debutFlash(c, t);
}
