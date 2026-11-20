// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton regarde son assiette, perplexe : « Alors mon assiette, c'est une publicité ? »
// s15b : le renard, bienveillant : « Pas forcément. Mange ce que tu aimes, mais sache pourquoi. » ; s15c : le mouton compte sur ses doigts, les trois questions s'écrivent au carnet ;
// s15d : « Exactement. Une blouse ne remplace pas une preuve. » — le mouton prend sa fourchette et goûte, le renard lui fait un clin d'œil.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 680; M.look = [-.5, .7]; M.froncer = .5; M.sourcil = .5;
  if (la >= 0 && lb < 0) { M.handR = [-130, -520]; M.poseR = 'ouverte'; }
  R.x = 390; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .7; M.look = [-.9, 0]; M.froncer = .1; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.3]; M.handL = [-40, -600]; M.poseL = 'pointe'; M.froncer = 0; M.sourire = .4; R.look = [.6, .6]; R.handL = [-60, -600]; R.poseL = 'poing'; }
  const mange = ld >= 0 ? ease(seg(ld, .4, 1.6)) : 0;
  if (ld >= 0) { M.look = [-.6, .6]; M.handR = [lerp(104, -110, mange), lerp(-366, -520, mange)]; M.poseR = 'poing'; M.sourire = 1; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => paquetBacon(cc, 970, 470, .42, .05) }, (cc) => {
    gueridon(cc, 560, 660, .55); assiette(cc, 550, 652, .36, { fumee: t, mange: mange * .4 }); tasse(cc, 615, 652, .4);
    if (lc >= 0) { const a = mainScene(R, -1); carnet(cc, a[0] + 70, a[1] - 40, .6, [['qui parle ?', clamp(u * 3)], ['qui paie ?', clamp(u * 3 - 1)], ['on me vend', clamp(u * 3 - 2)], ['quoi ?', clamp(u * 3 - 2)]], 1, -.04); }
    if (ld >= 0) { const h = mainScene(M, 1); fourchette(cc, h[0], h[1], .45, -.4); if (mange > .2 && mange < .95) tranche(cc, h[0] - 14, h[1] - 30, .18, .3); }
  });
  c.restore();
}
