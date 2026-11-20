// SCÈNE 11 — Plans 20-21 (TV + héros). Devant le kiosque couvert de unes « PANIQUE », le mouton (en couleur) : « Donc la grande panique… a été grossie par les journaux ? »
// Le renard montre d'une main la radio, de l'autre les journaux : « Oui. Une fiction qui imite les infos, puis des infos qui exagèrent. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 860, 140); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.2]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -580]; M.poseR = 'ouverte'; M.froncer = .6; M.sourcil = .9; }
  if (lb >= 0) { const two = lb > B[1] * .5; R.handR = [two ? -200 : 200, -620]; R.poseR = 'pointe'; R.sourcil = .5; M.look = [.9, -.1]; }
  nbEtCouleur(c, t, [[0, 520, 450, 1.06], [DUREE, 520, 440, 1.1]], (cc) => kiosqueNB(cc, t, {}), (cc) => { heros(cc, R, M); radio38(cc, 1000, 790, .3, t, 1); });
  debutFlash(c, t);
}
