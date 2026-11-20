// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton, un sushi entre ses baguettes : « Je les aime quand même, mes sushis au saumon. »
// s15b : le renard sourit : « Tant mieux. Aimer, c'est permis. Savoir, c'est mieux. » ; s15c : les deux questions s'écrivent au carnet ;
// s15d : « Exactement. Un nom aussi peut être une réclame. » — le mouton croque son sushi, ravi ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.4, .5]; M.sourire = .5; M.handR = [-80, -560]; M.poseR = 'poing';
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .8; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.sourire = .3; M.sourcil = .5; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const croque = ld >= 0 ? ease(seg(ld, .3, 1.1)) : 0;
  if (ld >= 0) { M.handR = [lerp(-80, -30, croque), lerp(-560, -700, croque)]; M.look = [-.6, -.1]; M.sourire = 1; M.lid = .5; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { barquetteSaumon(cc, 965, 480, .5, .05); tablePetitDej(cc, { tasse: 1, sushi: 1, t }); } }, (cc) => {
    const a = mainScene(M, 1); baguettes(cc, a[0] - 10, a[1] + 20, .5, 2.6); if (croque < .9) nigiri(cc, a[0] - 52, a[1] + 40, .5, -.2);
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui a', clamp(u * 3)], ['choisi', clamp(u * 3 - .5)], ['ce nom ?', clamp(u * 3 - 1.2)], ['pourquoi ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
