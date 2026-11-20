// SCÈNE 12 — Plans 22-23 (TV + héros). Les spectateurs comparent le discours de la tribune et la démonstration : « L'argument devient plus important que le costume. »
// Le mouton enlève ses lunettes de théâtre, le sourire retrouvé : « J'avais confondu allure et preuve. »
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 180, 900); voix(M, ['s12b'], t); R.y = 830; M.y = 830;
  const ote = ease(seg(lb, 0, .5)); if (lb >= 0) { M.handL = [-60, lerp(-366, -820, ote < 1 ? 1 : 0)]; M.handR = [60, lerp(-366, -820, ote < 1 ? 1 : 0)]; M.poseL = M.poseR = 'poing'; if (ote >= 1) { M.handR = [150, -560]; M.handL = [-104, -366]; M.sourire = 1.1; M.froncer = 0; } }
  nbEtCouleur(c, t, [[0, 540, 420, 1.05]], (cc) => {
    auditoriumNB(cc, t, { rideau: 1, diplome: 1, pupitre: 1, dossiers: 8, spot: .5 });
    dessine(cc, ORATEUR(t, 380, { face: 1, look: [.4, .2], sourire: .2, habit: habitBlouse, chapeau: LUNETTES(true) }));
    dessine(cc, figurant(t, 700, 1, { s: .46, y: 540, face: -1, tablier: 'blanc', look: [.6, 0], sourire: .8 }));
    for (let k = 0; k < 5; k++) dessine(cc, figurant(t, 260 + k * 140, k + 1, { s: .5, y: 960, face: k % 2 ? 1 : -1, look: [hash(k + Math.floor(t * 1.2)) > .5 ? .9 : -.9, -.4], chapeau: [COIFFE.casquette, COIFFE.foulard][k % 2] }));
  }, (cc) => { heros(cc, R, M); if (lb < 0) lunettesMouton(cc, M); else if (ote >= 1) { const [hx, hy] = mainScene(M, 1); ink(cc, 5, '#3a2410'); cc.beginPath(); cc.arc(hx, hy - 10, 13, 0, 7); cc.stroke(); cc.beginPath(); cc.arc(hx + 30, hy - 10, 13, 0, 7); cc.stroke(); } });
  debutFlash(c, t);
}
