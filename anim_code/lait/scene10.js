// SCÈNE 10 — Plans 18-19 (TV). s10a : au tableau noir : « MERCHANDISING — l’art de guider le client », une flèche sinueuse.
// s10b : les pas s’alignent ; à côté, le ticket de caisse s’allonge, s’allonge…
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) merchandising(cc, t, seg(la, 0, A[1])); else pasTicket(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
