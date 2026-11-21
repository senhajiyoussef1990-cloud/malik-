// SCÈNE 05 — Plans 08-09 (TV). s05a : le boulanger sort une fournée, les volutes d’odeur filent vers les rayons : « Le pain se vend tout seul. Et il fait vendre tout le reste ! »
// s05b : dans la volute s’ouvrent des souvenirs : la maison, l’enfance, la chaleur.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 420, 440, 1.15], [B[0], 520, 420, 1.05]]); grandMagasinNB(cc, t, { four: 1, odeur: seg(la, .2, 1), derriere: (c2) => { const P = voix(BOULANGER(t, 420, { y: 790, face: 1, look: [.6, -.2], sourire: 1.1, handR: [140, -560], poseR: 'poing' }), ['s05a'], t); dessine(c2, P); const h = mainF(P, 1); ink(c2, 6, GRIS.fonce); c2.beginPath(); c2.moveTo(h[0], h[1]); c2.lineTo(h[0] + 140, h[1] - 30); c2.stroke(); F(c2, ell(h[0] + 160, h[1] - 34, 34, 12), GRIS.clair, 2); painNB(c2, h[0] + 160, h[1] - 42, .5); } }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); souvenirs(cc, t, seg(lb, .1, B[1])); }
  });
  debutFlash(c, t);
}
