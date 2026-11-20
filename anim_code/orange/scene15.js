// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton regarde son verre, hésitant : « Alors je ne dois plus boire de jus ? »
// s15b : le renard, bienveillant : « Bois-en si tu aimes. Mais choisis-le, ne le subis pas. » ; s15c : le mouton réfléchit, le carnet s'écrit ;
// s15d : « Voilà. Une tradition, ça se questionne aussi. » — le renard prend une orange dans la corbeille et la lance en l'air ; le mouton boit une gorgée, ravi ; clin d'œil.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.3, .6]; M.froncer = .5; M.sourcil = .5; M.handR = [-60, -560]; M.poseR = 'poing';
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .7; M.look = [-.9, 0]; M.froncer = .1; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.froncer = 0; M.sourire = .4; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const boit = ld >= 0 ? ease(seg(ld, .3, 1.2)) : 0;
  if (ld >= 0) { M.handR = [lerp(-60, -30, boit), lerp(-560, -700, boit)]; M.look = [-.6, -.1]; M.sourire = 1; M.lid = .5; R.look = [1, 0]; R.sourire = 1.1; R.handR = [140, -640]; R.poseR = 'ouverte'; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { briqueJus(cc, 970, 470, .4, .05); tablePetitDej(cc, { tasse: 1, carafe: .6, corbeille: 1, t }); } }, (cc) => {
    const a = mainScene(M, 1); verreJus(cc, a[0], a[1] + 30, .55, .9 - boit * .3, { paille: 1, rondelle: 1 });
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['d’où vient', clamp(u * 3)], ['l’habitude ?', clamp(u * 3 - .5)], ['qui en', clamp(u * 3 - 1.5)], ['profite ?', clamp(u * 3 - 2)]], 1, -.04); }
    if (ld >= 0) { const h = mainScene(R, 1), s = Math.abs(Math.sin(ld * 3)); orangeFruit(cc, h[0] + 6, h[1] - 30 - s * 80, 20, ld * 4); }
  });
  c.restore();
}
