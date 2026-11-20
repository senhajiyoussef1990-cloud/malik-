// SCÈNE 06 — Plans 09-11 (TV). Le même passant : 1er passage, il l'oublie presque (façade) ; 2e, il la reconnaît (kiosque) ;
// 3e, elle paraît familière (haut-parleur du marché).
const A = L.s06a, B = L.s06b, C = L.s06c, DUREE = C[0] + C[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0], lc = t - C[0];
    const x = lc >= 0 ? lerp(560, 760, ease(seg(lc, 0, .6))) : lb >= 0 ? lerp(240, 470, ease(seg(lb, 0, .6))) : lerp(-60, 240, ease(seg(t, 0, A[0] + .7)));
    cam(cc, t, [[0, 260, 420, 1.5], [B[0] - .1, 260, 420, 1.5], [B[0] + .4, 480, 420, 1.5], [C[0] - .1, 480, 420, 1.5], [C[0] + .4, 780, 400, 1.45], [DUREE, 780, 400, 1.45]]);
    rueKiosqueNB(cc, t, { hp: lc >= 0 });
    const P = figurant(t, x, 2, { s: .5, y: 780, chapeau: COIFFE.casquette });
    const enMarche = (la < .7) || (lb >= 0 && lb < .6) || (lc >= 0 && lc < .6); if (enMarche) marche(P, t);
    if (la >= .7 && lb < 0) { P.look = [-.8, -.4]; if (la > A[1] * .6) { P.look = [.9, 0]; P.tilt = -.05; } }          // il voit l'affiche… et détourne les yeux
    if (lb >= .6 && lc < 0) { P.look = [-.6, -.3]; P.sourire = 1.2; P.sourcil = .8; P.tilt = .06; }                       // il la reconnaît et sourit
    if (lc >= .6) { P.look = [.6, -.8]; P.tilt = .16; P.sourire = .8; P.handR = [60, -700]; P.poseR = 'repos'; }        // il penche la tête vers le haut-parleur
    dessine(cc, P);
  });
  debutFlash(c, t);
}
