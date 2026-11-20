// SCÈNE 09 — Plans 16-17 (TV). s09a : dans les maisons, les ampoules claquent une à une (un éclair, puis le noir) ; au magasin, le graphique des ventes s'envole.
// s09b : une ménagère, debout sur un tabouret, dévisse encore une ampoule grillée, soupire : « Encore grillée ? Bon, j'en rachète une. »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 405, 1.0]]); cc.fillStyle = GRIS.noir; cc.fillRect(0, 0, W, H);
      for (let k = 0; k < 6; k++) { const x = 120 + (k % 3) * 200, y = 170 + Math.floor(k / 3) * 300, mort = la > .3 + k * .35; F(cc, poly([[x - 80, y + 120], [x + 80, y + 120], [x + 80, y - 20], [x - 80, y - 20]]), mort ? '#2a2826' : GRIS.clair, 3); F(cc, poly([[x - 90, y - 20], [x, y - 90], [x + 90, y - 20]]), GRIS.fonce, 3); ampouleNB(cc, x, y + 40, .5, mort ? 0 : .9, mort); if (Math.abs(la - (.3 + k * .35)) < .08) { F(cc, ell(x, y + 30, 60, 60), 'rgba(255,255,255,.9)', 0); } }
      tableauVentes(cc, 860, 420, 1.1, seg(la, .6, A[1]));
    } else {
      cam(cc, t, [[B[0], 560, 330, 1.25], [DUREE, 560, 340, 1.3]]);
      const Cl = voix(CLIENTE(t, 560, { y: 700, face: 1, look: [.1, -.9], froncer: .5, handR: [40, -780], poseR: 'poing', handL: [-120, -560], poseL: 'poing' }), ['s09b'], t);
      if (lb > B[1] * .5) { Cl.look = [.3, 0]; Cl.sourcil = 1; }
      cuisineNB(cc, t, { menu: 'leger', annee: 1927 });
      F(cc, poly([[500, 700], [620, 700], [610, 720], [510, 720]]), GRIS.fonce, 3); for (const dx of [-40, 40]) F(cc, poly([[560 + dx - 6, 720], [560 + dx + 6, 720], [560 + dx + 10, 800], [560 + dx - 2, 800]]), GRIS.fonce, 2);
      dessine(cc, Cl); const h = mainF(Cl, 1); ampouleNB(cc, h[0], h[1] - 60, .6, 0, 1, Math.PI); const b = mainF(Cl, -1); ampouleNB(cc, b[0], b[1] - 10, .4, 0, 0, .4);
    }
  });
  debutFlash(c, t);
}
