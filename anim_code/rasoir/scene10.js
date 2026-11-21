// SCÈNE 10 — Plans 18-19 (TV). s10a : « EN UNE GÉNÉRATION » : grand-mère (rien), mère (habitude), fille (NORME).
// s10b : « VOTE : SE RASER ? » — l’urne est vide, 0 bulletin… et pourtant le tampon tombe : OBLIGATOIRE.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) generation(cc, t, seg(la, 0, A[1])); else urneVide(cc, t, seg(lb, B[1] * .45, B[1] * .45 + .4)); });
  debutFlash(c, t);
}
