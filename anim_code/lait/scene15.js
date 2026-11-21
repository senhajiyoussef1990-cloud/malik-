// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton, résolu : « La prochaine fois, je fais une liste, et je m’y tiens. » ; s15b : le renard, montrant haut et bas : « Et tu regardes en haut et en bas des rayons, pas seulement en face. »
// s15c : au carnet : « Pourquoi ce produit est-il là, et en avais-je besoin ? » ; s15d : « Voilà. Le plan du magasin est fait pour lui, pas pour toi. » — le mouton brandit sa liste ; clin d’œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.sourcil = .4; M.sourire = .6;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { const up = Math.floor(lb * 1.2) % 2; R.handR = up ? [150, -780] : [150, -380]; R.poseR = 'pointe'; R.sourire = .7; M.look = [-.9, up ? -.6 : .6]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.sourire = 1; M.handL = [-60, -720]; M.poseL = 'poing'; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, sac: 1, lait: 1, t }) }, (cc) => {
    if (ld >= 0 || (la >= 0 && lb < 0)) { const a = mainScene(M, ld >= 0 ? -1 : 1); cc.save(); cc.translate(a[0], a[1] - 30); cc.rotate(-.1); F(cc, poly([[-30, -46], [30, -46], [30, 46], [-30, 46]]), '#fbf6ea', 2); cc.font = 'bold 11px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#3a3a6a'; ['LISTE', '☐ lait', '☐ pain'].forEach((l, k) => cc.fillText(l, 0, -26 + k * 20)); cc.restore(); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['pourquoi', clamp(u * 3)], ['est-il là ?', clamp(u * 3 - .6)], ['en avais-je', clamp(u * 3 - 1.4)], ['besoin ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
