// SCÈNE 06 — Plans 10-11 (TV). s06a : deux étiquettes côte à côte : « 99 c » commence par un 9, « 1 F » commence par un 1.
// s06b : un cerveau et ses deux tiroirs : PETITS PRIX / GROS PRIX ; l’étiquette « 0,99 F » glisse d’elle-même dans le tiroir des petits prix.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) deuxPremiers(cc, t, seg(la, .2, A[1])); else cerveauTiroirs(cc, t, seg(lb, .3, B[1] * .7)); });
  debutFlash(c, t);
}
