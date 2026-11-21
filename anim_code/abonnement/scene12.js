// SCÈNE 12 — Plans 22-23 (TV). s12a : « LA LOI : résilier doit être aussi simple que s’abonner ».
// s12b : un calendrier de 30 jours, le dernier entouré, et une sonnette : « rappel : J – 2 ! ».
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) loiResiliation(cc, t, seg(la, .2, A[1])); else rappel(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
