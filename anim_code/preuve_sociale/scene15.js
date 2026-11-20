// SCÈNE 15 — Plan 25 (TV → salon). « Le spectacle se termine. Le choix lui appartient. » La rue se vide ;
// un seul passant reste, son chapeau à la main, pensif. Zoom arrière jusqu'au salon coloré.
const A = L.s15a, ZD = 1.2, DUREE = (typeof GRILLE !== "undefined" ? GRILLE : A[0] + A[1] + .2 + ZD + 1.0), Z0 = Math.min(A[0] + A[1] + .15, DUREE - ZD - .4);
function scene(cc, t) {
  const v = ease(seg(t, .3, A[0] + A[1]));
  chapellerieNB(cc, t, { panneau: 1 - v, vedette: false, spot: .3 });
  const V = marchandBase(t, 760); V.face = -1; V.sourire = lerp(1.2, -.4, v); V.look = [.9, 0]; dessine(cc, V, drawVendeur);
  file(cc, t, 9, { chapeaux: 9, modif: (P, k) => {
    if (k === 1) { P.v = 3; P.chapeau = null; P.handR = [70, -470]; P.poseR = 'poing'; P.look = [0, .5]; P.tilt = .06; P.sourire = .5; return; }   // il garde le chapeau à la main et réfléchit
    const dep = clamp(v * 1.6 - k * .06); if (dep > 0) { P.x -= ease(dep) * 900; P.walk = t * 9 + k; P.bob = Math.abs(Math.sin(t * 9 + k)) * 6; P.face = 1; }
  } });
  if (t > .3) { const P = passant(t, 500 - 74, 3, { face: -1 }); P.handR = [70, -470]; P.poseR = 'poing'; P.look = [0, .5]; P.tilt = .06; dessine(cc, P, drawFigurant); chapeauNB(cc, P.x + 70 * .4 * -1, P.y + (-470 + 40) * .4, .3, 0, .4); }
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const z = ease(seg(t, Z0, Z0 + ZD));
  if (z <= 0) {
    enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 480, 420, 1.2], [A[0] + A[1], 450, 420, 1.0], [DUREE, 450, 420, 1.0]]); scene(cc, t); });
    debutFlash(c, t);
    if (t > Z0 - .25) flash(c, ease(seg(t, Z0 - .25, Z0)));
  } else {
    const R = renardBase(t), M = moutonBase(t); R.x = 420; R.look = [-.8, .2]; M.x = 760; M.look = [-1, .2]; M.handL = [-46, -480]; M.handR = [46, -480]; M.poseL = M.poseR = 'poing';
    c.save(); camEcran(c, 1 - z, [540, 405, 1.0]);
    dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => scene(cc, tt) }, (cc) => { const a = mainScene(M, 1), b = mainScene(M, -1); chapeauMode(cc, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 6, .44, 0); });
    c.restore();
    flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
  }
}
