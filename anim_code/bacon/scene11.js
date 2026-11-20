// SCÈNE 11 — Plans 20-21 (TV + héros). Dans la cuisine, le mouton (en couleur) se tourne vers le renard : « Donc personne n'a vérifié si le bacon était bon pour la santé ? »
// Le renard décroche une blouse blanche de son cintre et la montre : « Non. On a seulement emprunté la blouse du médecin. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 620, 400); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) { M.handR = [150, -560]; M.poseR = 'ouverte'; M.froncer = .7; M.sourcil = .9; }
  const k = ease(seg(lb, 0, .6));
  if (lb >= 0) { R.handR = [lerp(104, 190, k), lerp(-440, -780, k)]; R.poseR = 'poing'; R.sourcil = .6; M.look = [.9, -.3]; M.oreille = .4; }
  nbEtCouleur(c, t, [[0, 520, 430, 1.15], [DUREE, 540, 420, 1.18]], (cc) => {
    cuisineNB(cc, t, { menu: 'copieux', annee: 1925, pere: PERE(t, 200, { face: 1, look: [.6, .6], sourire: 1 }), mere: MERE(t, 930, { face: -1, look: [-.6, .4], sourire: .8 }), poele: true });
  }, (cc) => { heros(cc, R, M); if (lb >= 0) { const h = mainScene(R, 1); blouseCintre(cc, h[0], h[1] + 10, .5 * k + .05, Math.sin(t * 3) * .04); } });
  debutFlash(c, t);
}
