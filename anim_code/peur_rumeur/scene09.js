// SCÈNE 09 — Plans 15-16 (TV). « La panique se partage par imitation » : une personne court avec un panier sans savoir pourquoi, une seconde la suit.
// « Chaque récit grossit un peu le précédent » : l'ardoise « un bruit ? » devient une grande affiche alarmante.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    if (lb < -.1) {
      cam(cc, t, [[0, 540, 440, 1.2], [B[0], 540, 440, 1.25]]);
      placeNB(cc, t, { nuit: .1, affiche: true });
      const P1 = figurant(t, lerp(-80, 1200, seg(t, 0, A[1] + .8)), 1, { s: .46, y: 760, chapeau: COIFFE.foulard, face: 1, look: [.9, 0], sourire: -.8, froncer: 1 }); marche(P1, t, 14); P1.handR = [120, -480]; dessine(cc, P1);
      const [px, py] = mainF(P1, 1); F(cc, smooth([[px - 26, py], [px + 26, py], [px + 20, py + 34], [px - 20, py + 34]]), GRIS.moyen, 2.5); ink(cc, 3); cc.beginPath(); cc.arc(px, py, 22, Math.PI, 0); cc.stroke();   // le panier
      if (la > A[1] * .35) { const P2 = figurant(t, lerp(-80, 1200, seg(la, A[1] * .35, A[1] * .35 + 1.6)), 3, { s: .46, y: 780, chapeau: COIFFE.casquette, face: 1, look: [-.6, -.1], sourcil: 1 }); marche(P2, t, 14); dessine(cc, P2); }
      const P3 = figurant(t, 300, 2, { s: .44, y: 790, face: 1, look: [.9, 0], sourcil: .8, sourire: -.3, chapeau: COIFFE.casquette }); dessine(cc, P3);
    } else {                                                                  // les mots grossissent
      const u = ease(seg(lb, 0, B[1]));
      cam(cc, t, [[0, 540, 405, 1.0]]);
      cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H);
      cc.save(); cc.translate(540, 405); cc.scale(1 + u * .2, 1 + u * .2);
      F(cc, poly([[-380, -260], [380, -260], [380, 260], [-380, 260]]), lerp(0, 1, u) > .5 ? GRIS.blanc : '#2a302c', 6);
      const etapes = [['un bruit ?', 30, GRIS.blanc], ['du danger !', 60, GRIS.blanc], ['UN MONSTRE', 90, GRIS.noir], ["À L'ENTREPÔT !!!", 70, GRIS.noir]];
      const k = Math.min(3, Math.floor(u * 4)), [txt, sz, col] = etapes[k];
      cc.font = `bold ${sz}px Georgia`; cc.textAlign = 'center'; cc.fillStyle = col; if (k < 2) cc.fillText(txt, 0, 20);
      if (k >= 2) { cc.font = 'bold 60px Georgia'; cc.fillText(etapes[2][0], 0, -60); cc.font = 'bold 54px Georgia'; cc.fillText(etapes[3][0], 0, 40); dessinMonstre(cc, 0, 170, .5, 1); }
      cc.restore();
    }
  });
  debutFlash(c, t);
}
