// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard, près des projecteurs : « Oui. Et sur grand écran, ça ressemble à de l'amour. »
// s08b : la nuit, une rédactrice tape à la machine sous sa lampe, entourée de brouillons froissés ; la phrase apparaît lettre par lettre.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) {
    const [R, M] = herosTV(t, 300, 170); voix(R, ['s08a'], t); R.look = [-.8, 0]; M.look = [.8, 0];
    if (la >= 0) { R.handR = [220, -640]; R.poseR = 'ouverte'; R.sourire = .6; R.lid = .5; M.oreille = .3; }
    nbEtCouleur(c, t, [[0, 540, 420, 1.12]], (cc) => { cinemaNB(cc, t, { film: (c2) => { const Vd = VEDETTE(t, 560, { y: 470, s: .42, face: -1, look: [-.2, 0], sourire: 1, handR: [-180, -620], poseR: 'ouverte' }); sceneFilm(c2, t, Vd, null); } }); }, (cc) => heros(cc, R, M));
  } else {
    enNoirEtBlanc(c, t, (cc) => {
      cam(cc, t, [[B[0], 540, 430, 1.05], [DUREE, 520, 440, 1.15]]);
      const Rd = figurant(t, 250, 1, { s: .5, y: 860, face: 1, look: [.8, .3], froncer: .4, handL: [120, -470], handR: [200, -470], poseL: 'poing', poseR: 'poing', chapeau: (c2, hy) => { for (let k = -3; k <= 3; k++) F(c2, ell(k * 16, hy - 66 + Math.abs(k) * 7, 15, 13), GRIS.noir, 0); } });
      Rd.handL[1] += Math.abs(Math.sin(t * 14)) * 12; Rd.handR[1] += Math.abs(Math.sin(t * 14 + 1)) * 12;
      redactionNB(cc, t, { texte: seg(lb, .5, B[1] + .3), derriere: (c2) => dessine(c2, Rd) });
    });
  }
  debutFlash(c, t);
}
