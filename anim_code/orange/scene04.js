// SCÈNE 04 — Plans 06-07 (TV). s04a : le verger déborde, les cagettes s'empilent, les oranges roulent par terre.
// s04b : le panneau du prix dégringole (10 → 1 cent) et un producteur, la mort dans l'âme, abat un oranger.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 430, 1.1], [B[0], 600, 420, 1.12], [DUREE, 680, 430, 1.2]]);
    const P = PRODUCTEUR(t, 720, { face: 1, look: [.8, -.4], froncer: .6, sourcil: .3 });
    if (lb >= 0) { const sw = Math.sin(lb * 6); P.handL = [60, -560 - sw * 120]; P.handR = [120, -560 - sw * 120]; P.poseL = P.poseR = 'poing'; P.lean = .08 * sw; }
    vergerNB(cc, t, { cagettes: Math.min(9, Math.floor(1 + seg(la, 0, A[1]) * 9)), prix: lb >= 0 ? seg(lb, 0, B[1] * .6) : null, coupe: seg(lb, B[1] * .5, B[1] + .2), derriere: (c2) => dessine(c2, P) });
    if (lb >= 0 && seg(lb, B[1] * .5, B[1]) < 1) { const h = mainF(P, 1), sw = Math.sin(lb * 6); cc.save(); cc.translate(h[0], h[1]); cc.rotate(-1 - sw * .8); F(cc, poly([[-4, 0], [4, 0], [4, 110], [-4, 110]]), GRIS.fonce, 2); F(cc, poly([[-4, 100], [30, 96], [34, 124], [-4, 118]]), GRIS.clair, 2); cc.restore(); }
  });
  debutFlash(c, t);
}
