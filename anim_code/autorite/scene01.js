// SCÈNE 01 — Plans 01-02. Le mouton devant l'affiche de l'homme en blouse : « Il porte une blouse ! Ça doit être sérieux. »
// Le renard l'inspecte : le titre de l'« expert » est minuscule. « Une tenue peut inspirer confiance. Pas la prouver. »
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), la = t - A[0], lb = t - B[0];
  M.x = 640; M.look = [-1, -.4]; M.sourcil = .9; M.froncer = .1; M.sourire = .8; if (la >= 0) { M.handR = [210, -620]; M.poseR = 'pointe'; }
  R.x = 400; R.look = [-.9, -.3];
  let lp = 0; if (lb >= 0) { lp = ease(seg(lb, 0, .4)); R.handL = [lerp(-104, -220, lp), lerp(-440, -700, lp)]; R.poseL = 'poing'; R.lean = -.05 * lp; R.lid = .45; M.handR = [104, -366]; M.poseR = 'repos'; M.look = [-1, 0]; }
  c.save(); cam(c, t, [[0, 420, 380, 1.35], [DUREE, 400, 380, 1.4]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => afficheExpert(cc, 150, 200, .7, lp) }, (cc) => { if (lp > 0) { const [hx, hy] = mainScene(R, -1); loupe(cc, hx - 4, hy - 50, .8, .3); } });
  c.restore();
}
