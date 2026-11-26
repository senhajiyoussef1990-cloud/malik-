// SCÈNE 03 — TV. le personnage de la fable
const A = L.s03a, B = L.s03b, DUREE = B[0] + B[1] + .35;
const XA = ((cc, t, u) => marche(cc, t, { prix: String(Math.round(10 * Math.pow(10, clamp(u * 1.2) * 2))), derriere: (c2) => dessine(c2, voix(MARCHAND3(t, 830, { face: -1, look: [-.6, 0], sourire: 1.3, handR: [170, -680], poseR: 'pointe' }), ['s03a'], t)) })), XB = ((cc, t, u) => marche(cc, t, { prix: '1 000', derriere: (c2) => { for (let k = 0; k < 5; k++) dessine(c2, figurant(t, 110 + k * 210, (k + 1) % 5, { s: .44, y: 840, face: k < 2 ? 1 : -1, look: [k < 2 ? .5 : -.5, -.3], sourire: 1, handR: [120, -620], poseR: 'ouverte' })); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.06], [B[0], 540, 405, 1.0]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.07]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
