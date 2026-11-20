// SCÈNE 09 — Plans 16-17 (TV). Une personne du public lève la main : « Qui a vérifié votre affirmation ? »
// L'orateur recule et montre son diplôme encadré au lieu de répondre.
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 400, 560, 1.4], [B[0] - .1, 400, 560, 1.4], [B[0] + .4, 640, 360, 1.3], [DUREE, 640, 360, 1.3]]);
    auditoriumNB(cc, t, { rideau: 1, diplome: 1, pupitre: 1, dossiers: 8, spot: 1, spotX: lb >= 0 ? 700 : 540 });
    const O = ORATEUR(t, lb >= 0 ? lerp(540, 640, ease(seg(lb, 0, .6))) : 540, { face: 1, look: [-.3, .6], habit: habitBlouse, chapeau: LUNETTES(true) });
    if (lb >= 0) { O.handR = [260, -760]; O.poseR = 'ouverte'; O.look = [.8, -.3]; O.sourire = 1.2; }
    dessine(cc, O);
    const Q = figurant(t, 400, 3, { s: .54, y: 920, face: 1, look: [.5, -.8], chapeau: COIFFE.casquette });
    if (la >= 0) { voix(Q, ['s09a'], t); Q.handR = [60, -1000]; Q.poseR = 'ouverte'; } dessine(cc, Q);
  });
  debutFlash(c, t);
}
