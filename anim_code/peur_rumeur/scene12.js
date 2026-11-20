// SCÈNE 12 — Plans 21-22 (TV + héros). Le gardien ouvre prudemment : le vent fait grincer une charnière rouillée.
// Le mouton regarde la charnière, puis le dessin : « Le dessin était bien plus effrayant que la réalité. » Il replie l'affiche.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0], R = renardBase(t), M = voix(moutonBase(t), ['s12b'], t);
  R.x = 380; R.y = 790; R.s = .5; M.x = 680; M.y = 800; M.s = .47; R.look = [.6, -.2]; M.look = [-.6, -.3];
  const porte = la >= 0 ? .5 + Math.sin(t * 3) * .12 : .1;
  M.handR = [130, -400]; M.poseR = 'poing'; R.handL = [-130, -460]; R.poseL = 'poing';
  let plie = 0; if (lb >= 0) { plie = ease(seg(lb, B[1] * .5, B[1] + .2)); M.handL = [-80, -560]; M.poseL = 'poing'; M.look = lb < B[1] * .5 ? [-.4, -.4] : [0, .6]; M.sourire = .7; M.froncer = .2; R.sourire = .8; R.look = [.9, 0]; }
  const keys = [[0, 540, 420, 1.25], [A[0] + .4, 500, 430, 1.9], [B[0], 560, 440, 1.3], [DUREE, 600, 450, 1.4]];
  nbEtCouleur(c, t, keys, (cc) => {
    ruelleNB(cc, t, { nuit: .75, porte, lanterne: [mainScene(R, -1), mainScene(M, 1)] });
    const G = figurant(t, 640, 3, { s: .46, y: 600, chapeau: COIFFE.casquette, face: -1, look: [.7, -.2], lean: .06 }); G.handR = [120, -500]; G.poseR = 'ouverte'; dessine(cc, G);
    if (la >= 0) { cc.save(); cc.font = 'italic bold 30px Georgia'; cc.fillStyle = GRIS.blanc; cc.fillText('grrriii…', 400, 340 + Math.sin(t * 6) * 6); cc.restore(); }
  }, (cc) => {
    for (const P of [R, M]) { cc.save(); cc.translate(0, -P.bob); (P === R ? drawRenard : drawMouton)(cc, P); cc.restore(); }
    const a = mainScene(R, -1), b = mainScene(M, 1); lanterne(cc, a[0], a[1] + 20); lanterne(cc, b[0], b[1] + 20);
    if (lb >= 0) { const [hx, hy] = mainScene(M, -1); cc.save(); cc.translate(hx, hy - 60); cc.scale(1, 1 - plie * .8); F(cc, poly([[-50, -60], [50, -60], [50, 60], [-50, 60]]), '#f4f0e6', 3); dessinMonstre(cc, 0, 10, .32, 1); cc.restore(); }
  });
  debutFlash(c, t);
}
