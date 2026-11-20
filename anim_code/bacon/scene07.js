// SCÈNE 07 — Plans 12-13 (TV + héros). Bernays, aimable, demande au médecin : « Docteur, un petit-déjeuner copieux, c'est meilleur pour la santé ? » Le médecin réfléchit, la main au menton.
// Le mouton (en couleur, dans un coin du cabinet) chuchote au renard : « Il ne parle pas du tout de bacon ! »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 330, 190); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [.9, -.2]; M.handR = [90, -600]; M.poseR = 'ouverte'; M.sourcil = 1; M.lean = .05; R.look = [-.6, .1]; R.sourcil = .5; }
  nbEtCouleur(c, t, [[0, 520, 420, 1.12], [DUREE, 500, 420, 1.15]], (cc) => {
    const D = DOCTEUR(t, 640, { face: -1, look: [-.8, 0], handR: [60, -660], poseR: 'poing' });
    if (la > A[1] * .6) { D.look = [-.5, -.5]; D.tilt -= .06; D.sourcil = .6; }
    if (lb >= 0) { D.look = [-.8, -.2]; D.sourire = .5; }
    const Bn = voix(BERNAYS(t, 470, { face: 1, look: [.8, 0], chapeau: false, sourire: .9 }), ['s07a'], t); if (la >= 0 && lb < 0) { Bn.handR = [150, -620]; Bn.poseR = 'ouverte'; }
    cabinetNB(cc, t, { derriere: (c2) => dessine(c2, D) }); dessine(cc, Bn, drawVendeur);
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
