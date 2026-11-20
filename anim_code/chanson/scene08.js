// SCÈNE 08 — Plans 14-15 (TV). s08a : la jauge : à chaque écoute, un point noircit (1, 2, 3… 10).
// s08b : en face, le thermomètre « J'AIME » monte avec les écoutes : « familier… donc agréable ? »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0], [DUREE, 540, 405, 1.04]]); jaugeFamilier(cc, t, seg(t, A[0], B[0] + B[1])); notesNB(cc, 300, 700, t, 3, .6); });
  debutFlash(c, t);
}
