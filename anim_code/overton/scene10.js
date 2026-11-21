// SCÈNE 10 — TV. 
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => fenetreOverton(cc, t, u, { p: 2 + Math.sin(t * 1.2) * 1.6, deuxSens: 1, legende: 'vers le mieux… ou vers le pire' })), XB = ((cc, t, u) => fenetreOverton(cc, t, u, { p: 1 + clamp(u) * 3, legende: 'qui la pousse ?' }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
