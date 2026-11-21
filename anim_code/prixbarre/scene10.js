// SCÈNE 10 — Plans 18-19 (TV). s10a : un livre de loi, « prix de référence », tamponné CONTRÔLÉ.
// s10b : un calendrier : l’ancien prix « 200 F » affiché un seul jour… puis des semaines de « –50 % ».
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) loiNB(cc, t, seg(la, A[1] * .5, A[1] * .5 + .4)); else calendrierCourt(cc, t, seg(lb, 0, B[1])); });
  debutFlash(c, t);
}
