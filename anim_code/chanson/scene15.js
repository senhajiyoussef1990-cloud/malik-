// SCÈNE 15 — Plans 26-29 (salon). s15a : la radio du buffet est éteinte ; le mouton tient la pochette, hésitant : « Alors, j'aime vraiment cette chanson, ou pas ? »
// s15b : le renard pose le disque sur le tourne-disque : « Peut-être. Écoute-la loin de la radio, et décide. » ; s15c : les questions s'écrivent au carnet ;
// s15d : « Voilà. Répéter n'est pas prouver. » — le disque tourne doucement, le mouton écoute les yeux fermés… et hausse les épaules en souriant ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.3, .5]; M.froncer = .5; M.sourcil = .5; M.handR = [-60, -560]; M.poseR = 'poing';
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [220, -500]; R.poseR = 'pointe'; R.sourire = .6; M.look = [-.9, .3]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.froncer = 0; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.lid = ld < D[1] * .6 ? .05 : .5; M.sourire = 1; M.tilt += Math.sin(t * 2.5) * .05; M.handL = [-150, -470]; M.handR = [150, -470]; M.poseL = M.poseR = 'ouverte'; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, disque: 1, joue: lb >= 0, t }) }, (cc) => {
    if (ld < 0) { const a = mainScene(M, 1); pochette(cc, a[0] - 10, a[1] + 10, .45, -.1); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['pourquoi', clamp(u * 3)], ['partout ?', clamp(u * 3 - .6)], ['qui a', clamp(u * 3 - 1.4)], ['payé ?', clamp(u * 3 - 2)]], 1, -.04); }
    if (lb >= 0) for (let k = 0; k < 3; k++) { const v = (t * .4 + k / 3) % 1; cc.save(); cc.globalAlpha = .8 * (1 - v); note(cc, 470 + k * 30 + Math.sin(v * 6 + k) * 20, 560 - v * 160, k % 2); cc.restore(); }
  });
  c.restore();
}
