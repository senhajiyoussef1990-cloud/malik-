// SCÈNE 06 — Plans 10-11 (TV). s06a : « il sent un peu de la bouche » se dissout et devient, énorme, « HALITOSE (maladie) ».
// s06b : à une noce, sous la pluie de riz, la mariée rayonne au bras de son mari ; à l'écart, une demoiselle d'honneur, seule, son bouquet à la main.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); motGeant(cc, t, seg(la, .3, 1.3)); }
    else { cam(cc, t, [[B[0], 540, 420, 1.05], [DUREE, 800, 430, 1.25]]); noceNB(cc, t, { derriere: (c2) => { dessine(c2, MARIEE(t, 480, { face: 1, look: [.6, 0], sourire: 1.2 })); dessine(c2, figurant(t, 600, 0, { s: .52, y: 790, face: -1, look: [-.6, 0], sourire: 1 })); dessine(c2, DEMOISELLE(t, 900, { face: -1, look: [-.6, .5], froncer: .6 })); } }); }
  });
  debutFlash(c, t);
}
