// SCÈNE 11 — Plans 20-21 (TV + héros). Sur l'avenue après le défilé, les journaux traînent par terre ; le mouton (en couleur) : « Donc ce n'était pas un mouvement de femmes, mais une réclame ? »
// Le renard ramasse une page et la montre : « Une réclame déguisée en combat. C'est bien plus efficace. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 640, 400); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.froncer = .6; M.sourcil = .9; }
  const k = ease(seg(lb, 0, .6)); if (lb >= 0) { R.handR = [lerp(104, 170, k), lerp(-440, -640, k)]; R.poseR = 'poing'; R.sourcil = .5; M.look = [.9, -.2]; }
  nbEtCouleur(c, t, [[0, 540, 430, 1.12], [DUREE, 540, 420, 1.15]], (cc) => { avenueNB(cc, t, { drapeaux: 1 }); for (let q = 0; q < 6; q++) { cc.save(); cc.translate(120 + q * 170, 760 + (q % 2) * 20); cc.rotate(hash(q) - .5); cc.scale(1, .4); uneTorches(cc, 0, 0, .14, {}); cc.restore(); } },
    (cc) => { heros(cc, R, M); if (lb >= 0) { const h = mainScene(R, 1); uneTorches(cc, h[0] + 10, h[1] - 50, .16 * k + .01, { rot: .05 }); } });
  debutFlash(c, t);
}
