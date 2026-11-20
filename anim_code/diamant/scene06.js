// SCÈNE 06 — Plans 10-11 (TV). s06a : au cinéma, sur le grand écran, une vedette tend la main : sa bague scintille ; dans la salle, on soupire.
// s06b : dans un lycée, un conférencier en costume montre au tableau « LA BAGUE DE FIANÇAILLES = amour véritable ».
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 330, 1.18]]);
      cinemaNB(cc, t, { film: (c2) => { const Vd = VEDETTE(t, 560, { y: 470, s: .42, face: -1, look: [-.2, 0], sourire: 1, handR: [-180, -620], poseR: 'ouverte' }); sceneFilm(c2, t, Vd, null); const h = mainF(Vd, 1); bagueNB(c2, h[0], h[1] - 8, .3, t); } });
    } else {
      cam(cc, t, [[B[0], 540, 380, 1.1], [DUREE, 540, 370, 1.14]]);
      const Cf = PUBLICITAIRE(t, 820, { y: 640, s: .42, face: -1, look: [-.8, -.2], sourire: .8, handL: [-220, -640], poseL: 'pointe' });
      classeNB(cc, t, { derriere: (c2) => dessine(c2, Cf, drawVendeur) });
    }
  });
  debutFlash(c, t);
}
