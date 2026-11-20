// SCÈNE 01 — Plans 01-02 (salon). Le mouton brandit son paquet « BISCUITS DORÉS » à 2 F, ravi : « Mon paquet de biscuits n'a pas augmenté. Super ! »
// Le renard, sa tasse sur la table, désigne la fenêtre du paquet : « Le prix, non. Mais compte donc les biscuits. »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.handR = [-70, -560]; M.poseR = 'poing'; M.sourire = 1; M.look = [-.4, -.1]; M.lid = .55;
  if (la >= 0 && lb < 0) M.handR[1] -= Math.abs(Math.sin(la * 5)) * 20;
  R.x = 345; R.look = [.9, .2];
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.handR = [lerp(104, 250, k), lerp(-440, -600, k)]; R.poseR = 'pointe'; R.sourcil = .6; R.lean = .04 * k; M.look = [-.2, .5]; }
  c.save(); cam(c, t, [[0, 600, 420, 1.38], [B[0], 560, 410, 1.38], [DUREE, 560, 410, 1.42]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, cafetiere: 1, t }) }, (cc) => { const a = mainScene(M, 1); paquetBiscuits(cc, a[0] - 10, a[1] + 10, .55, { n: 12, rot: -.06 }); });
  c.restore();
}
