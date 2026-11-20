// SCÈNE 01 — Plans 01-02. Le mouton ouvre des enveloppes colorées, l'air fébrile : « La prochaine cache peut-être un cadeau ! »
// Le renard remarque la boîte qui distribue des tickets au hasard : « C'est le prochain essai qui t'attire ? »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
const COLS = ['#e8504a', '#2a6a8a', '#e3a42c', '#4a8a4a', '#8a3a8a'];
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  const n = Math.floor(t * 1.2) % 5, ph = (t * 1.2) % 1;
  M.x = 640; M.handL = [-150, -560]; M.handR = [-30, -560 + Math.sin(ph * 6) * 20]; M.poseL = M.poseR = 'poing'; M.look = [-.5, .6]; M.sourcil = .9; M.sourire = .9; M.froncer = 0;
  R.x = 400; R.look = [.8, .2]; if (lb >= 0) { R.look = [1, .4]; R.lid = .55; R.sourcil = .8; R.handR = [220, -560]; R.poseR = 'pointe'; }
  c.save(); cam(c, t, [[0, 600, 420, 1.35], [DUREE, 640, 420, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { boiteTickets(cc, 900, 508, .8, t); for (let k = 0; k < 4; k++) enveloppe(cc, 840 + k * 30, 640 - k * 4, .4, COLS[k], 1, (k - 2) * .2); } }, (cc) => { const a = mainScene(M, -1), b = mainScene(M, 1); enveloppe(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 30, .6, COLS[n], ph, -.05); });
  c.restore();
}
