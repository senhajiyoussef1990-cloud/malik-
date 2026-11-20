// SCÈNE 06 — Plans 10-11 (TV). « La décision devient précipitée » : le client prend la casserole sans regarder.
// « Sous pression, il oublie sa propre liste » : il cherche ses pièces et laisse tomber sa liste de courses.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 640, 460, 1.3], [DUREE, 680, 480, 1.35]]);
    standNB(cc, t, { panneau: 1, sablier: .6 + t * .04, prix: true });
    dessine(cc, VENDEUR(t, 420, { face: 1, look: [.8, 0], sourire: 1.3, handL: [-80, -480], handR: [80, -480], poseL: 'poing', poseR: 'poing' }), drawVendeur);
    const P = figurant(t, 860, 2, { s: .48, y: 790, face: -1, chapeau: COIFFE.casquette, look: [.9, -.3], sourcil: 1 });
    const pr = ease(seg(la, .1, .5)); P.handR = [lerp(80, 220, pr), lerp(-420, -560, pr)]; P.poseR = 'poing';
    if (lb >= 0) { P.handL = [-60, -460 + Math.sin(t * 14) * 20]; P.poseL = 'poing'; P.look = [0, .8]; P.froncer = 1; P.bob += Math.abs(Math.sin(t * 9)) * 4; }
    dessine(cc, P);
    if (pr > 0) { const [hx, hy] = mainF(P, 1); casserole(cc, hx, hy - 10, .7, .3); }
    if (lb >= 0) { const ch = ease(seg(lb, .3, 1.2)); listeCourses(cc, lerp(820, 760, ch), lerp(620, 790, ch), .7, ch * 1.4); }
  });
  debutFlash(c, t);
}
