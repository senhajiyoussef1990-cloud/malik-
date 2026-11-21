// SCÈNE 06 — Plans 10-11 (TV). s06a : le journal du matin : « LE TABAC MIS EN CAUSE PAR LES MÉDECINS » ; à côté, en gros plan, le filtre : « plus sûr ? »
// s06b : au comptoir, deux fumeurs ricanent devant un paquet à filtre et se moquent de celui qui le prend.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); journalSante(cc, t, seg(la, .1, A[1])); }
    else { cam(cc, t, [[B[0], 540, 420, 1.08]]); tabacNB(cc, t, { derriere: (c2) => { const X = FUMEUR(t, 360, { face: 1, look: [.5, .3], froncer: .4, handR: [90, -560], poseR: 'poing' }); dessine(c2, X); for (const [x, v] of [[640, 0], [800, 5]]) dessine(c2, figurant(t, x, v, { s: .5, y: 790, face: -1, look: [-.7, .1], sourire: 1.2, rire: Math.sin(t * 8) > 0 ? 1 : 0, handL: [-40, -660], poseL: 'ouverte' })); const h = mainF(X, 1); paquetNB(c2, h[0], h[1] + 10, .5, { dame: 1 }); } }); }
  });
  debutFlash(c, t);
}
