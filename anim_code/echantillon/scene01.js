// SCÈNE 01 — Plans 01-02 (salon). Sur la table, une montagne de fromages ; le mouton grignote encore le petit morceau offert : « On m’a offert un échantillon de fromage au marché. Du coup, j’ai acheté tout le fromage ! »
// Le renard : « Tu en avais envie, ou tu te sentais obligé ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.handR = [-60, -620]; M.poseR = 'poing'; M.handL = [-160, -520]; M.poseL = 'ouverte'; M.look = [-.6, .4]; M.sourire = .9;
  R.x = 345; R.look = [.8, .3]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; M.sourire = .3; M.handL = [-96, -400]; }
  c.save(); cam(c, t, [[0, 600, 440, 1.38], [B[0], 520, 420, 1.36], [DUREE, 520, 420, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, fromage: 1, t }) }, (cc) => { const a = mainScene(M, 1); fromageMain(cc, a[0], a[1] + 10, .5); });
  c.restore();
}
