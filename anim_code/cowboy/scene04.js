// SCÈNE 04 — Plans 06-07 (TV). s04a : au tabac, une dame élégante choisit le paquet blanc « Douce » au bout coloré.
// s04b : l’affiche : « Douce comme le mois de mai », une couronne de fleurs autour de la dame.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 420, 1.05], [B[0], 520, 450, 1.2]]); tabacNB(cc, t, { derriere: (c2) => { const D = figurant(t, 520, 4, { s: .5, y: 790, face: 1, look: [.5, .3], sourire: .8, handR: [110, -540], poseR: 'poing' }); dessine(c2, D); dessine(c2, figurant(t, 820, 0, { s: .5, y: 790, face: -1, look: [-.6, 0], tablier: 'blanc' })); } }); paquetNB(cc, 600, 520 + Math.sin(t * 2) * 3, .6, { dame: 1 }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 420, 1.06]]); afficheMai(cc, t, seg(lb, 0, B[1])); }
  });
  debutFlash(c, t);
}
