// SCÈNE 03 — TV. le personnage de la fable
const A = L.s03a, B = L.s03b, DUREE = B[0] + B[1] + .35;
const XA = ((cc, t, u) => auberge(cc, t, { plat: 0, derriere: (c2) => dessine(c2, voix(AUBERGISTE(t, 330, { face: 1, look: [.6, 0], sourire: 1.2, handR: [170, -660], poseR: 'ouverte' }), ['s03a'], t)) })), XB = ((cc, t, u) => auberge(cc, t, { avant: (c2) => dessine(c2, VOYAGEUR(t, 760, { face: -1, look: [-.5, .3], sourire: .9, handR: [100, -480], poseR: 'poing' })) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.06], [B[0], 540, 405, 1.0]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.07]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
