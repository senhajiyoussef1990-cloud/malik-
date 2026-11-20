// SCÈNE 12 — Plans 22-23 (TV). s12a : un même texte banal lu deux fois — avec un ton d'annonce de journal (micro, « FLASH SPÉCIAL »), il paraît soudain très sérieux.
// s12b : « CE QU'ON A RACONTÉ » (une énorme une « PANIQUE GÉNÉRALE ») face à « CE QUI S'EST PASSÉ » (quelques appels, quelques auditeurs inquiets).
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 405, 1.0]]); cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H);
      for (const [x, serieux] of [[290, 0], [790, 1]]) { F(cc, poly([[x - 220, 140], [x + 220, 140], [x + 220, 680], [x - 220, 680]]), GRIS.blanc, 5); cc.font = 'bold 26px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText(serieux ? 'TON DES INFORMATIONS' : 'TON NORMAL', x, 200); cc.font = serieux ? 'bold 30px Georgia' : 'italic 26px Georgia'; ['« Un chat a été vu', 'sur le toit', 'de la mairie. »'].forEach((l, k) => cc.fillText(l, x, 330 + k * 44)); if (serieux && la > .5) { F(cc, poly([[x - 150, 520], [x + 150, 520], [x + 150, 580], [x - 150, 580]]), GRIS.noir, 3); cc.font = 'bold 28px Georgia'; cc.fillStyle = GRIS.blanc; cc.fillText('FLASH SPÉCIAL', x, 560); ink(cc, 6, GRIS.noir); cc.beginPath(); cc.moveTo(x + 170, 680); cc.lineTo(x + 170, 600); cc.stroke(); F(cc, smooth([[x + 156, 600], [x + 156, 560], [x + 170, 548], [x + 184, 560], [x + 184, 600]]), GRIS.fonce, 2); } }
    } else { cam(cc, t, [[B[0], 540, 405, 1.0]]); loupePanique(cc, t, seg(lb, .5, 1.3)); }
  });
  debutFlash(c, t);
}
