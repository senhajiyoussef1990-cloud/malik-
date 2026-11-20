// SCÈNE 10 — Plans 18-19 (TV). s10a : des caisses « SĀMON » arrivent par cargo ; sur le tapis du bar à sushis, les assiettes défilent avec l'étiquette « 100 ¥ ».
// s10b : une cliente goûte, ravie : « Ce sāmon est doux et fondant. J'en reprends ! »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 405, 1.05], [B[0], 540, 430, 1.1]]);
      barNB(cc, t, { tapis: 1, sushis: 8, prix: '100 ¥' });
      for (let k = 0; k < 3; k++) { const x = lerp(-200, 260 + k * 160, ease(seg(la, k * .3, k * .3 + 1))); F(cc, poly([[x - 70, 560], [x + 70, 560], [x + 70, 470], [x - 70, 470]]), GRIS.clair, 3); cc.font = 'bold 22px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('SĀMON', x, 522); }
    } else {
      cam(cc, t, [[B[0], 560, 420, 1.35], [DUREE, 560, 410, 1.4]]);
      const Cl = voix(CLIENTE(t, 560, { face: 1, look: [0, 0], sourire: 1.2, handR: [-40, -640], poseR: 'poing' }), ['s10b'], t);
      if (lb > B[1] * .55) { Cl.handL = [-160, -620]; Cl.poseL = 'ouverte'; Cl.lid = .4; }
      barNB(cc, t, { tapis: 1, sushis: 6, derriere: (c2) => dessine(c2, Cl) });
      const h = mainF(Cl, 1); cc.save(); cc.translate(h[0], h[1]); cc.rotate(-.4); F(cc, poly([[-2, 0], [2, 0], [2, 70], [-2, 70]]), GRIS.fonce, 1); F(cc, poly([[8, 0], [12, 0], [12, 70], [8, 70]]), GRIS.fonce, 1); cc.restore(); nigiriNB(cc, h[0] - 4, h[1] - 6, .5);
    }
  });
  debutFlash(c, t);
}
