// SCÈNE 10 — Plans 18-19 (TV). s10a : dans la cuisine d'une famille, la boîte trône sur la table ; la phrase s'écrit au mur comme une devise encadrée.
// s10b : la balance des études : « oui ? » d'un côté, « non ? » de l'autre, l'aiguille hésite… « pas si clair ! »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 600, 430, 1.12]]);
      cuisineNB(cc, t, { menu: 'leger', annee: 1955, pere: PERE(t, 360, { face: 1, look: [.5, .6], sourire: .6 }), mere: MERE(t, 820, { face: -1, look: [.6, .4], sourire: .8 }), dessus: (c2) => { boiteNB(c2, 600, 540, .5, { sucre: true, slogan: true }); for (const x of [470, 720]) bolNB(c2, x, 620, .4, 1); } });
      const u = seg(la, .3, A[1]); cc.save(); cc.translate(300, 150); F(cc, poly([[-170, -50], [170, -50], [170, 50], [-170, 50]]), GRIS.fonce, 6); F(cc, poly([[-160, -40], [160, -40], [160, 40], [-160, 40]]), GRIS.blanc, 1.5); const tx = 'Le repas le plus important'; cc.font = 'italic bold 20px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText(tx.slice(0, Math.ceil(tx.length * u)), 0, 8); cc.restore();
    } else { cam(cc, t, [[B[0], 540, 405, 1.0]]); etudesNB(cc, t, seg(lb, .2, B[1])); }
  });
  debutFlash(c, t);
}
