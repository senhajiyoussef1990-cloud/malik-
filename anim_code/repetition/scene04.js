// SCÈNE 04 — Plans 06-07 (TV). s04a : l'imprimeur aligne les caractères de « La boisson des vainqueurs ». s04b : la presse l'imprime encore et encore.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 300, 470, 1.6], [A[0] + A[1], 300, 470, 1.6], [B[0] - .1, 700, 420, 1.25], [DUREE, 760, 430, 1.35]]);
    const vit = lb >= 0 ? 1.8 : .3;
    imprimerieNB(cc, t, { vit, pile: lb >= 0 ? 2 + lb * 3.2 : 1, lettres: clamp(la / (A[1] + .2)) });
    const I = figurant(t, 230, 0, { s: .5, y: 770, tablier: 'taches', chapeau: COIFFE.visiere, look: [.2, .8], face: 1 });
    if (la >= 0 && lb < 0) { const p = Math.floor(la * 4) % 2; I.handR = [70 + p * 30, -580]; I.handL = [-60, -560]; I.poseR = 'pointe'; I.poseL = 'poing'; I.lean = .08; I.sourire = 1; }
    if (lb >= 0) { I.x = 430; I.look = [.9, -.1]; I.sourire = 1.3; I.handR = [120, -700]; I.poseR = 'ouverte'; I.tilt = wob(tq, 1.4, .06); }
    dessine(cc, I);
  });
  debutFlash(c, t);
}
