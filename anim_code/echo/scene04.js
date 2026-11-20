// SCÈNE 04 — Plans 06-07 (TV). À la sortie du village, un homme crie : « Le pont est fermé ! » Les montagnes lui renvoient sa propre voix, de plus en plus déformée.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 640, 480, 1.3], [B[0], 640, 480, 1.3], [B[0] + .5, 540, 405, 1.0], [DUREE, 540, 405, 1.0]]);
    valleeNB(cc, t, {});
    const Cr = CRIEUR(t, 620, { look: [.2, -.6] }); if (la > A[1] * .4 && lb < 0) { Cr.talk = .6; Cr.handL = [-60, -760]; Cr.handR = [60, -760]; Cr.poseL = Cr.poseR = 'ouverte'; } dessine(cc, Cr);
    if (lb >= 0) ECHOS.forEach(([x, y, txt], k) => echo(cc, 620, 420, x, y, seg(lb, k * .3, k * .3 + 1.6), txt));
  });
  debutFlash(c, t);
}
