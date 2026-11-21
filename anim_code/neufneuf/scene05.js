// SCÈNE 05 — Plans 08-09 (TV). s05a : l’épicier, scandalisé, montre la vitrine d’en face : « Il écrit quatre-vingt-dix-neuf centimes au lieu d’un franc… et il vend plus que moi ! »
// s05b : un grand œil parcourt « 0,99 » de gauche à droite… et s’arrête sur le premier chiffre.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 420, 420, 1.2], [B[0], 460, 420, 1.24]]); rivauxNB(cc, t, { derriere: (c2) => { dessine(c2, voix(EPICIER(t, 300, { face: 1, look: [.9, -.1], froncer: .9, sourcil: 1, handR: [190, -620], poseR: 'pointe', handL: [-60, -680], poseL: 'ouverte' }), ['s05a'], t)); for (let k = 0; k < 3; k++) dessine(c2, figurant(t, 700 + k * 110, [1, 4, 0][k], { s: .44, y: 790, face: -1, look: [-.5, -.2] })); } }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); oeilLecture(cc, t, seg(lb, .2, B[1] * .9), { texte: ['0', ',', '9', '9'] }); }
  });
  debutFlash(c, t);
}
